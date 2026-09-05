<script lang="ts">
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import { RequestButton } from '$presentation/components/ui';
  import {
    CONTACTS_CONSENT,
    CONTACTS_FORM_FIELDS,
    CONTACTS_FORM_TITLE,
    CONTACTS_WAGON_TYPES,
  } from '$shared/constants/contacts';
  import { submitContactsForm } from '$infrastructure/api/submit-form';

  const API_URL = (env.PUBLIC_API_URL ?? '').replace(/\/$/, '');
  const CHALLENGE_URL = API_URL ? `${API_URL}/captcha/challenge` : '';

  const CAPTCHA_STRINGS = JSON.stringify({
    label: 'Я не робот',
    verified: 'Проверено',
    verifying: 'Проверяю...',
    waitAlert: 'Идёт проверка, подождите...',
    error: 'Ошибка проверки. Попробуйте ещё раз.',
    footer: 'Защита от спама ALTCHA',
  });

  let captchaEnabled = $state(false);
  let captchaModalOpen = $state(false);
  let captchaToken = '';

  onMount(async () => {
    if (!CHALLENGE_URL) return;
    try {
      const response = await fetch(CHALLENGE_URL);
      if (!response.ok) return;
      await import('altcha');
      captchaEnabled = true;
    } catch {}
  });

  function handleCaptchaState(event: CustomEvent) {
    const { state, payload } = event.detail ?? {};
    captchaToken = state === 'verified' ? payload : '';
    if (state === 'verified' && captchaModalOpen) {
      captchaModalOpen = false;
      void doSubmit();
    }
  }

  function closeCaptchaModal() {
    captchaModalOpen = false;
  }

  $effect(() => {
    if (!captchaModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCaptchaModal();
    };
    window.addEventListener('keydown', onKeydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeydown);
    };
  });

  interface FormErrors {
    name?: string;
    phone?: string;
    email?: string;
    wagonType?: string;
  }

  interface TouchedFields {
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    wagonType?: boolean;
  }

  let name = $state('');
  let phone = $state('');

  function formatPhone(value: string): string {
    let digits = value.replace(/\D/g, '');

    if (!digits.startsWith('7')) {
      digits = '7' + digits;
    }

    digits = digits.slice(0, 11);

    const area = digits.slice(1, 4);
    const part1 = digits.slice(4, 7);
    const part2 = digits.slice(7, 9);
    const part3 = digits.slice(9, 11);

    let result = '+7';
    if (area) result += ` (${area})`;
    if (part1) result += ` ${part1}`;
    if (part2) result += `-${part2}`;
    if (part3) result += `-${part3}`;

    return result;
  }

  function handlePhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    phone = formatPhone(input.value);
  }

  function handlePhoneFocus() {
    if (!phone) {
      phone = '+7';
    }
  }
  let email = $state('');
  let company = $state('');
  let wagonType = $state('');
  let directionFrom = $state('');
  let directionTo = $state('');
  let comment = $state('');
  let consent = $state(false);
  let isSubmitting = $state(false);
  let errors = $state<FormErrors>({});
  let touched = $state<TouchedFields>({});
  let formError = $state('');
  let formSuccess = $state('');
  let successTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

  const isFormValid = $derived(
    !validateName(name) && !validatePhone(phone) && !validateWagonType(wagonType) && consent
  );
  const isSubmitDisabled = $derived(isSubmitting || !isFormValid);

  function validateName(value: string): string | undefined {
    const trimmed = value.trim();
    if (!trimmed) return 'Обязательное поле';
    if (trimmed.length < 2) return 'Имя должно содержать не менее 2 символов';
    return undefined;
  }

  function validatePhone(value: string): string | undefined {
    const digits = value.replace(/\D/g, '');
    if (!digits || digits === '7') return 'Обязательное поле';
    if (digits.length < 11) return 'Введите корректный номер телефона';
    return undefined;
  }

  function validateEmail(value: string): string | undefined {
    if (!value.trim()) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Введите корректный email';
    return undefined;
  }

  function validateWagonType(value: string): string | undefined {
    if (!value) return 'Обязательное поле';
    return undefined;
  }

  $effect(() => {
    if (touched.name) errors.name = validateName(name);
  });

  $effect(() => {
    if (touched.phone) errors.phone = validatePhone(phone);
  });

  $effect(() => {
    if (touched.email) errors.email = validateEmail(email);
  });

  $effect(() => {
    if (touched.wagonType) errors.wagonType = validateWagonType(wagonType);
  });

  $effect(() => {
    return () => {
      if (successTimeout) clearTimeout(successTimeout);
    };
  });

  function resetForm() {
    name = '';
    phone = '';
    email = '';
    company = '';
    wagonType = '';
    directionFrom = '';
    directionTo = '';
    comment = '';
    consent = false;
    touched = {};
    errors = {};
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    formError = '';
    formSuccess = '';

    touched = { name: true, phone: true, email: true, wagonType: true };
    errors = {
      name: validateName(name),
      phone: validatePhone(phone),
      email: validateEmail(email),
      wagonType: validateWagonType(wagonType),
    };

    if (errors.name || errors.phone || errors.email || errors.wagonType || !consent) {
      if (!consent && !errors.name && !errors.phone && !errors.wagonType) {
        formError = 'Необходимо согласие на обработку персональных данных';
      }
      return;
    }

    if (captchaEnabled && !captchaToken) {
      captchaModalOpen = true;
      return;
    }

    await doSubmit();
  }

  async function doSubmit() {
    isSubmitting = true;

    try {
      await submitContactsForm({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        company: company.trim(),
        wagonType,
        directionFrom: directionFrom.trim(),
        directionTo: directionTo.trim(),
        comment: comment.trim(),
        captchaToken: captchaToken || undefined,
      });

      formSuccess = 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.';
      if (successTimeout) clearTimeout(successTimeout);
      successTimeout = setTimeout(() => {
        formSuccess = '';
      }, 3000);
      resetForm();
    } catch (error) {
      formError =
        error instanceof Error ? error.message : 'Не удалось отправить форму. Попробуйте позже.';
    } finally {
      // токен капчи одноразовый
      captchaToken = '';
      isSubmitting = false;
    }
  }
</script>

<style lang="scss">
  @use './_contacts-form.scss';

  .captcha-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;

    &__backdrop {
      position: absolute;
      inset: 0;
      border: none;
      padding: 0;
      cursor: default;
      background: rgba(10, 25, 50, 0.55);
      backdrop-filter: blur(4px);
    }

    &__box {
      position: relative;
      width: 100%;
      max-width: 340px;
      padding: 28px 24px 24px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
      text-align: center;
    }

    &__title {
      margin: 0 0 16px;
      font-size: 16px;
      font-weight: 600;
      color: #15294b;
    }

    &__close {
      position: absolute;
      top: 6px;
      right: 10px;
      border: none;
      background: none;
      padding: 4px 8px;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      color: #15294b;
      opacity: 0.5;

      &:hover {
        opacity: 1;
      }
    }

    &__widget {
      display: flex;
      justify-content: center;
    }
  }
</style>

<form class="contacts-form" onsubmit={handleSubmit} novalidate>
  <h2 class="contacts-form__title">{CONTACTS_FORM_TITLE}</h2>

  <div class="contacts-form__grid">
    <div class="contacts-form__field">
      <label
        class="contacts-form__label"
        class:contacts-form__label--required={CONTACTS_FORM_FIELDS.name.required}
        for="contacts-name">
        {CONTACTS_FORM_FIELDS.name.label}
        {#if CONTACTS_FORM_FIELDS.name.required}
          <span class="contacts-form__required" aria-hidden="true">*</span>
        {/if}
      </label>
      <input
        id="contacts-name"
        class="contacts-form__input"
        class:contacts-form__input--error={touched.name && errors.name}
        type="text"
        name="name"
        autocomplete="name"
        placeholder={CONTACTS_FORM_FIELDS.name.placeholder}
        bind:value={name}
        onblur={() => (touched.name = true)}
        aria-invalid={touched.name && errors.name ? 'true' : 'false'}
        aria-describedby={touched.name && errors.name ? 'contacts-name-error' : undefined} />
      {#if touched.name && errors.name}
        <span id="contacts-name-error" class="contacts-form__error" role="alert">
          {errors.name}
        </span>
      {/if}
    </div>

    <div class="contacts-form__field">
      <label
        class="contacts-form__label"
        class:contacts-form__label--required={CONTACTS_FORM_FIELDS.phone.required}
        for="contacts-phone">
        {CONTACTS_FORM_FIELDS.phone.label}
        {#if CONTACTS_FORM_FIELDS.phone.required}
          <span class="contacts-form__required" aria-hidden="true">*</span>
        {/if}
      </label>
      <input
        id="contacts-phone"
        class="contacts-form__input"
        class:contacts-form__input--error={touched.phone && errors.phone}
        type="tel"
        name="phone"
        autocomplete="tel"
        placeholder={CONTACTS_FORM_FIELDS.phone.placeholder}
        value={phone}
        oninput={handlePhoneInput}
        onfocus={handlePhoneFocus}
        onblur={() => (touched.phone = true)}
        aria-invalid={touched.phone && errors.phone ? 'true' : 'false'}
        aria-describedby={touched.phone && errors.phone ? 'contacts-phone-error' : undefined} />
      {#if touched.phone && errors.phone}
        <span id="contacts-phone-error" class="contacts-form__error" role="alert">
          {errors.phone}
        </span>
      {/if}
    </div>

    <div class="contacts-form__field">
      <label class="contacts-form__label" for="contacts-email">
        {CONTACTS_FORM_FIELDS.email.label}
      </label>
      <input
        id="contacts-email"
        class="contacts-form__input"
        class:contacts-form__input--error={touched.email && errors.email}
        type="email"
        name="email"
        autocomplete="email"
        placeholder={CONTACTS_FORM_FIELDS.email.placeholder}
        bind:value={email}
        onblur={() => (touched.email = true)}
        aria-invalid={touched.email && errors.email ? 'true' : 'false'}
        aria-describedby={touched.email && errors.email ? 'contacts-email-error' : undefined} />
      {#if touched.email && errors.email}
        <span id="contacts-email-error" class="contacts-form__error" role="alert">
          {errors.email}
        </span>
      {/if}
    </div>

    <div class="contacts-form__field">
      <label class="contacts-form__label" for="contacts-company">
        {CONTACTS_FORM_FIELDS.company.label}
      </label>
      <input
        id="contacts-company"
        class="contacts-form__input"
        type="text"
        name="company"
        autocomplete="organization"
        placeholder={CONTACTS_FORM_FIELDS.company.placeholder}
        bind:value={company} />
    </div>

    <div class="contacts-form__field contacts-form__field--half">
      <label
        class="contacts-form__label"
        class:contacts-form__label--required={CONTACTS_FORM_FIELDS.wagonType.required}
        for="contacts-wagon-type">
        {CONTACTS_FORM_FIELDS.wagonType.label}
        {#if CONTACTS_FORM_FIELDS.wagonType.required}
          <span class="contacts-form__required" aria-hidden="true">*</span>
        {/if}
      </label>
      <div class="contacts-form__select-wrap">
        <select
          id="contacts-wagon-type"
          class="contacts-form__input contacts-form__select"
          class:contacts-form__input--error={touched.wagonType && errors.wagonType}
          name="wagonType"
          bind:value={wagonType}
          onblur={() => (touched.wagonType = true)}
          aria-invalid={touched.wagonType && errors.wagonType ? 'true' : 'false'}
          aria-describedby={touched.wagonType && errors.wagonType
            ? 'contacts-wagon-type-error'
            : undefined}>
          <option value="">{CONTACTS_FORM_FIELDS.wagonType.placeholder}</option>
          {#each CONTACTS_WAGON_TYPES as option (option.value)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
      {#if touched.wagonType && errors.wagonType}
        <span id="contacts-wagon-type-error" class="contacts-form__error" role="alert">
          {errors.wagonType}
        </span>
      {/if}
    </div>

    <div class="contacts-form__field contacts-form__field--half">
      <span class="contacts-form__label" id="contacts-direction-label">
        {CONTACTS_FORM_FIELDS.direction.label}
      </span>
      <div class="contacts-form__direction" role="group" aria-labelledby="contacts-direction-label">
        <input
          id="contacts-direction-from"
          class="contacts-form__input"
          type="text"
          name="directionFrom"
          placeholder={CONTACTS_FORM_FIELDS.direction.fromPlaceholder}
          bind:value={directionFrom} />
        <span class="contacts-form__direction-arrow" aria-hidden="true">→</span>
        <input
          id="contacts-direction-to"
          class="contacts-form__input"
          type="text"
          name="directionTo"
          placeholder={CONTACTS_FORM_FIELDS.direction.toPlaceholder}
          bind:value={directionTo} />
      </div>
    </div>

    <div class="contacts-form__field contacts-form__field--full">
      <label class="contacts-form__label" for="contacts-comment">
        {CONTACTS_FORM_FIELDS.comment.label}
      </label>
      <input
        id="contacts-comment"
        class="contacts-form__input"
        type="text"
        name="comment"
        placeholder={CONTACTS_FORM_FIELDS.comment.placeholder}
        bind:value={comment} />
    </div>
  </div>

  <div class="contacts-form__footer">
    <label class="contacts-form__consent">
      <input
        class="contacts-form__checkbox"
        type="checkbox"
        name="consent"
        bind:checked={consent} />
      <span class="contacts-form__consent-text">
        <span class="contacts-form__required" aria-hidden="true">*</span>
        {CONTACTS_CONSENT.prefix}
        <a class="contacts-form__consent-link" href={resolve('/privacy/')}>
          {CONTACTS_CONSENT.linkLabel}
        </a>{CONTACTS_CONSENT.suffix}
      </span>
    </label>

    <RequestButton variant="solid" type="submit" disabled={isSubmitDisabled} />
  </div>

  {#if captchaModalOpen}
    <div
      class="captcha-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Проверка, что вы не робот">
      <button
        type="button"
        class="captcha-modal__backdrop"
        aria-label="Закрыть"
        onclick={closeCaptchaModal}></button>
      <div class="captcha-modal__box">
        <button
          type="button"
          class="captcha-modal__close"
          aria-label="Закрыть"
          onclick={closeCaptchaModal}>
          ×
        </button>
        <p class="captcha-modal__title">Подтвердите, что вы не робот</p>
        <altcha-widget
          class="captcha-modal__widget"
          challengeurl={CHALLENGE_URL}
          strings={CAPTCHA_STRINGS}
          onstatechange={handleCaptchaState}></altcha-widget>
      </div>
    </div>
  {/if}

  {#if formError}
    <div class="contacts-form__message contacts-form__message--error" role="alert">
      {formError}
    </div>
  {/if}

  {#if formSuccess}
    <div class="contacts-form__message contacts-form__message--success" role="status">
      {formSuccess}
    </div>
  {/if}
</form>
