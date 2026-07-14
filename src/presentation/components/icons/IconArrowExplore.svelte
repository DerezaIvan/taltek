<style lang="scss">
  .explore-arrow {
    --explore-arrow-size: 13px;
    --explore-arrow-length: 29px;
    --explore-arrow-line-height: 26px;
    --explore-arrow-rotate-duration: 0.25s;
    --explore-arrow-stretch-duration: 0.35s;
    --explore-arrow-ease: cubic-bezier(0.4, 0, 0.2, 1);
    --explore-arrow-pivot-x: 48.3%;
    --explore-arrow-pivot-y: 49.91%;

    position: relative;
    display: inline-flex;
    align-items: center;
    align-self: center;
    justify-content: flex-end;
    flex-shrink: 0;
    width: var(--explore-arrow-size);
    height: var(--explore-arrow-line-height);
    margin-top: 0;
    overflow: visible;
    line-height: 0;
    transition: width var(--explore-arrow-stretch-duration) var(--explore-arrow-ease) 0s;
  }

  .explore-arrow__svg {
    position: absolute;
    top: calc(50% - var(--explore-arrow-size) / 2);
    right: 0;
    display: block;
    transform-origin: var(--explore-arrow-pivot-x) var(--explore-arrow-pivot-y);
  }

  .explore-arrow__svg--long {
    width: var(--explore-arrow-length);
    height: var(--explore-arrow-size);
    clip-path: inset(0 0 0 calc(100% - var(--explore-arrow-size)));
    visibility: hidden;
    transition:
      visibility 0s linear var(--explore-arrow-stretch-duration),
      clip-path var(--explore-arrow-stretch-duration) var(--explore-arrow-ease) 0s;
  }

  .explore-arrow__svg--short {
    width: var(--explore-arrow-size);
    height: var(--explore-arrow-size);
    visibility: visible;
    transform: rotate(-45deg);
    transition:
      visibility 0s linear var(--explore-arrow-stretch-duration),
      transform var(--explore-arrow-rotate-duration) var(--explore-arrow-ease)
        var(--explore-arrow-stretch-duration);
  }

  :global(.action-button--ghost:hover:not(:disabled)) .explore-arrow {
    width: var(--explore-arrow-length);
    transition: width var(--explore-arrow-stretch-duration) var(--explore-arrow-ease)
      var(--explore-arrow-rotate-duration);
  }

  :global(.action-button--ghost:hover:not(:disabled)) .explore-arrow__svg--short {
    visibility: hidden;
    transform: rotate(0deg);
    transition:
      visibility 0s linear var(--explore-arrow-rotate-duration),
      transform var(--explore-arrow-rotate-duration) var(--explore-arrow-ease) 0s;
  }

  :global(.action-button--ghost:hover:not(:disabled)) .explore-arrow__svg--long {
    visibility: visible;
    clip-path: inset(0 0 0 0);
    transition:
      visibility 0s linear var(--explore-arrow-rotate-duration),
      clip-path var(--explore-arrow-stretch-duration) var(--explore-arrow-ease)
        var(--explore-arrow-rotate-duration);
  }

  @media (prefers-reduced-motion: reduce) {
    .explore-arrow,
    .explore-arrow__svg--short,
    .explore-arrow__svg--long {
      transition: none;
    }

    :global(.action-button--ghost:hover:not(:disabled)) .explore-arrow {
      width: var(--explore-arrow-length);
    }

    :global(.action-button--ghost:hover:not(:disabled)) .explore-arrow__svg--short {
      visibility: hidden;
      transform: rotate(0deg);
    }

    :global(.action-button--ghost:hover:not(:disabled)) .explore-arrow__svg--long {
      visibility: visible;
      clip-path: inset(0 0 0 0);
    }
  }
</style>

<span class="explore-arrow" aria-hidden="true">
  <svg
    class="explore-arrow__svg explore-arrow__svg--long"
    width="42"
    height="17"
    viewBox="0 0 42 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.34464e-06 9.65024L4.09176e-06 7.67035L37.3318 7.49533L31.2506 1.41421L32.6649 4.13482e-07L41.1501 8.48528L32.6649 16.9706L31.2506 15.5564L37.3318 9.47524L4.34464e-06 9.65024Z"
      fill="currentColor"
    />
  </svg>
  <svg
    class="explore-arrow__svg explore-arrow__svg--short"
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5075e-05 9.47525L1.48222e-05 7.49535H13.5765L7.49535 1.41423L8.90956 1.44839e-05L17.3948 8.4853L8.90956 16.9706L7.49535 15.5564L13.5765 9.47525L1.5075e-05 9.47525Z"
      fill="currentColor"
    />
  </svg>
</span>
