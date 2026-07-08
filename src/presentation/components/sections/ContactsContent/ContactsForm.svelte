<script lang="ts">
  import { resolve } from '$app/paths';
  import { RequestButton } from '$presentation/components/ui';
  import {
    CONTACTS_CONSENT,
    CONTACTS_FORM_FIELDS,
    CONTACTS_FORM_TITLE,
    CONTACTS_WAGON_TYPES,
  } from '$shared/constants/contacts';
  import { submitContactsForm } from '$infrastructure/api/submit-form';

  let name = $state('');
  let phone = $state('');
  let email = $state('');
  let company = $state('');
  let wagonType = $state('');
  let directionFrom = $state('');
  let directionTo = $state('');
  let comment = $state('');
  let consent = $state(false);
  let isSubmitting = $state(false);

  const isSubmitDisabled = $derived(isSubmitting || !consent || !name.trim() || !phone.trim());

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

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
      });

      name = '';
      phone = '';
      email = '';
      company = '';
      wagonType = '';
      directionFrom = '';
      directionTo = '';
      comment = '';
      consent = false;
    } catch {
      return;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<style lang="scss">
  @use './_contacts-form.scss';
</style>

<form class="contacts-form" onsubmit={handleSubmit}>
  <h2 class="contacts-form__title">{CONTACTS_FORM_TITLE}</h2>

  <div class="contacts-form__grid">
    <div class="contacts-form__field">
      <label class="contacts-form__label" for="contacts-name">
        {CONTACTS_FORM_FIELDS.name.label}
        {#if CONTACTS_FORM_FIELDS.name.required}
          <span class="contacts-form__required" aria-hidden="true">*</span>
        {/if}
      </label>
      <input
        id="contacts-name"
        class="contacts-form__input"
        type="text"
        name="name"
        autocomplete="name"
        placeholder={CONTACTS_FORM_FIELDS.name.placeholder}
        bind:value={name}
        required
      />
    </div>

    <div class="contacts-form__field">
      <label class="contacts-form__label" for="contacts-phone">
        {CONTACTS_FORM_FIELDS.phone.label}
        {#if CONTACTS_FORM_FIELDS.phone.required}
          <span class="contacts-form__required" aria-hidden="true">*</span>
        {/if}
      </label>
      <input
        id="contacts-phone"
        class="contacts-form__input"
        type="tel"
        name="phone"
        autocomplete="tel"
        placeholder={CONTACTS_FORM_FIELDS.phone.placeholder}
        bind:value={phone}
        required
      />
    </div>

    <div class="contacts-form__field">
      <label class="contacts-form__label" for="contacts-email">
        {CONTACTS_FORM_FIELDS.email.label}
      </label>
      <input
        id="contacts-email"
        class="contacts-form__input"
        type="email"
        name="email"
        autocomplete="email"
        placeholder={CONTACTS_FORM_FIELDS.email.placeholder}
        bind:value={email}
      />
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
        bind:value={company}
      />
    </div>

    <div class="contacts-form__field contacts-form__field--half">
      <label class="contacts-form__label" for="contacts-wagon-type">
        {CONTACTS_FORM_FIELDS.wagonType.label}
      </label>
      <div class="contacts-form__select-wrap">
        <select
          id="contacts-wagon-type"
          class="contacts-form__input contacts-form__select"
          name="wagonType"
          bind:value={wagonType}
        >
          <option value="">{CONTACTS_FORM_FIELDS.wagonType.placeholder}</option>
          {#each CONTACTS_WAGON_TYPES as option (option.value)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
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
          bind:value={directionFrom}
        />
        <span class="contacts-form__direction-arrow" aria-hidden="true">→</span>
        <input
          id="contacts-direction-to"
          class="contacts-form__input"
          type="text"
          name="directionTo"
          placeholder={CONTACTS_FORM_FIELDS.direction.toPlaceholder}
          bind:value={directionTo}
        />
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
        bind:value={comment}
      />
    </div>
  </div>

  <div class="contacts-form__footer">
    <label class="contacts-form__consent">
      <input
        class="contacts-form__checkbox"
        type="checkbox"
        name="consent"
        bind:checked={consent}
      />
      <span class="contacts-form__consent-text">
        {CONTACTS_CONSENT.prefix}
        <a class="contacts-form__consent-link" href={resolve('/privacy/')}>
          {CONTACTS_CONSENT.linkLabel}
        </a>{CONTACTS_CONSENT.suffix}
      </span>
    </label>

    <RequestButton variant="solid" type="submit" disabled={isSubmitDisabled} />
  </div>
</form>
