<script lang="ts">
  import { PRIVACY_INTRO, PRIVACY_SECTIONS } from '$shared/constants/privacy';
  import type { PrivacyPageContent } from '$infrastructure/cms';

  const { content = null }: { content?: PrivacyPageContent | null } = $props();

  const intro = $derived(content ? [content.intro] : PRIVACY_INTRO);
  const sections = $derived(
    content && content.sections.length > 0 ? content.sections : PRIVACY_SECTIONS
  );
</script>

<style lang="scss">
  @use './_privacy-content.scss';
</style>

<section class="privacy-content">
  <div class="container privacy-content__inner">
    <div class="privacy-content__intro">
      {#each intro as paragraph (paragraph)}
        <p class="privacy-content__paragraph">{paragraph}</p>
      {/each}
    </div>

    {#each sections as section (section.id)}
      <article class="privacy-content__section" aria-labelledby="privacy-{section.id}">
        <h2 id="privacy-{section.id}" class="privacy-content__section-title">{section.title}</h2>

        {#each section.blocks ?? [] as block, index (`${section.id}-${index}`)}
          {#if block.type === 'paragraph'}
            <p class="privacy-content__paragraph">{block.text}</p>
          {:else}
            <ul class="privacy-content__list">
              {#each block.items ?? [] as item, itemIndex (`${section.id}-item-${itemIndex}`)}
                <li class="privacy-content__list-item">{item}</li>
              {/each}
            </ul>
          {/if}
        {/each}
      </article>
    {/each}
  </div>
</section>
