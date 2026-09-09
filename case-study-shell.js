/**
 * Case study component shell
 * =========================================================================
 * Every section of a case study page is one component here. A page is built
 * by listing sections in a config object; nothing is hard-coded per project.
 *
 *   <div id="case-study-root"></div>
 *   <script src="case-study-shell.js"></script>
 *   <script>
 *     window.caseStudyConfig = {
 *       sections: [
 *         { type: 'hero', title: 'SEED', ... },
 *         { type: 'sectionHeader', title: 'SEED', subtitle: 'Results', video: 'img/logic.mp4' },
 *         { type: 'comparison', columns: [...] },
 *       ],
 *     };
 *   </script>
 *
 * Components can also be called directly to compose markup by hand:
 *
 *   document.body.innerHTML = CaseStudy.components.sectionHeader({
 *     title: 'Reviews', subtitle: 'What the team said',
 *     video: 'img/logic.mp4', align: 'right',
 *   });
 *
 * Every component takes a plain props object and returns an HTML string, so
 * variations are just different props. Shared variants:
 *   align   'left' | 'right'      which side the media/heading sits on
 *   tone    'lime' | 'neutral'    accent surface colour
 *   columns 1 | 2 | 3             grid density
 * =========================================================================
 */
(function (global) {
  'use strict';

  /* ---------------------------------------------------------------- utils */

  var SECTION_X = 'px-4 md:px-10 lg:px-24';

  function esc(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Text that may legitimately contain markup such as <br> or <strong>.
  function rich(value) {
    return value === null || value === undefined ? '' : String(value);
  }

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i]) out.push(arguments[i]);
    }
    return out.join(' ');
  }

  function list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  function pad(index) {
    return String(index + 1).padStart(2, '0');
  }

  function section(inner, props) {
    props = props || {};
    return (
      '<section class="' +
      cx('w-full self-stretch flex flex-col justify-start items-start', props.gap || 'gap-6', props.class) +
      '">' +
      inner +
      '</section>'
    );
  }

  /* ----------------------------------------------------------- primitives */

  /**
   * The lime ring that wraps a looping video (or gif/image).
   * size: 'md' (default, 7rem) | 'sm' | 'lg'
   */
  function mediaRing(props) {
    props = props || {};
    var sizes = { sm: 'size-20', md: 'size-28', lg: 'size-36' };
    var inner = props.video
      ? '<video class="w-full h-full object-cover object-center block" src="' +
        esc(props.video) +
        '" autoplay loop muted playsinline></video>'
      : props.image
        ? '<img class="w-full h-full object-cover object-center block" src="' +
          esc(props.image) +
          '" alt="' +
          esc(props.alt || '') +
          '" />'
        : '';

    return (
      '<div class="' +
      cx(sizes[props.size] || sizes.md, 'shrink-0 p-2.5 bg-lime-400/40 rounded-full flex justify-center items-center') +
      '">' +
      '<div class="size-full p-2.5 bg-lime-400/60 rounded-full flex justify-center items-center">' +
      '<div class="size-full relative bg-lime-400 rounded-full outline outline-[3px] outline-lime-400 overflow-hidden">' +
      inner +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function tagPill(label, props) {
    props = props || {};
    var tone =
      props.tone === 'dark'
        ? 'bg-neutral-950 text-white'
        : props.tone === 'lime'
          ? 'bg-lime-400 text-green-900'
          : 'bg-white text-stone-500 outline outline-1 outline-offset-[-1px] outline-zinc-100';
    var iconSrc = props.icon || 'img/bullet-green.svg';
    return (
      '<span class="' +
      cx('pl-2.5 pr-3 py-1.5 rounded-3xl text-sm md:text-base inline-flex items-center gap-1.5', tone) +
      '">' +
      '<img class="size-3 md:size-4 shrink-0" src="' + esc(iconSrc) + '" alt="" />' +
      esc(label) +
      '</span>'
    );
  }

  function statCard(item) {
    return (
      '<div class="min-w-0 px-6 py-5 bg-lime-400 rounded-3xl flex flex-col justify-center items-center text-center gap-1 overflow-hidden">' +
      '<span class="text-green-900 text-3xl lg:text-4xl font-medium leading-none">' +
      rich(item.value) +
      '</span>' +
      '<span class="w-full text-green-900 text-lg lg:text-2xl font-normal leading-tight">' +
      rich(item.label) +
      '</span>' +
      '</div>'
    );
  }

  /* -------------------------------------------------------------- icons */

  var ARROW_UP_RIGHT =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M9.02051 2.09961C9.15422 2.09961 9.28241 2.1535 9.37695 2.24805C9.4715 2.34259 9.52539 2.47078 9.52539 2.60449V7.20801C9.52539 7.34172 9.4715 7.4699 9.37695 7.56445C9.28241 7.65895 9.15418 7.71191 9.02051 7.71191C8.88692 7.71182 8.75853 7.65892 8.66406 7.56445C8.56967 7.46993 8.5166 7.3416 8.5166 7.20801V3.82129L3.71094 8.62695C3.61639 8.7215 3.4882 8.77535 3.35449 8.77539C3.22073 8.77539 3.09263 8.72154 2.99805 8.62695C2.90346 8.53237 2.84961 8.40427 2.84961 8.27051C2.84965 8.1368 2.9035 8.00861 2.99805 7.91406L7.80371 3.1084H4.41699C4.2834 3.1084 4.15507 3.05533 4.06055 2.96094C3.96608 2.86647 3.91318 2.73808 3.91309 2.60449C3.91309 2.47082 3.96605 2.34259 4.06055 2.24805C4.15509 2.1535 4.28328 2.09961 4.41699 2.09961H9.02051Z" fill="currentColor" stroke="currentColor" stroke-width="0.3"/></svg>';

  // Icons inherit their colour, so they work on any surface.
  var icons = {
    arrowUpRight: ARROW_UP_RIGHT,
    linkedin:
      '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.72727 11.4545C9.45059 11.4545 10.1443 11.1672 10.6557 10.6557C11.1672 10.1443 11.4545 9.45059 11.4545 8.72727C11.4545 8.00396 11.1672 7.31026 10.6557 6.7988C10.1443 6.28734 9.45059 6 8.72727 6C8.00396 6 7.31026 6.28734 6.7988 6.7988C6.28734 7.31026 6 8.00396 6 8.72727C6 9.45059 6.28734 10.1443 6.7988 10.6557C7.31026 11.1672 8.00396 11.4545 8.72727 11.4545ZM11.4545 30V13.6364H6V30H11.4545ZM13.6364 13.6364H18.5455V15.7593C19.3265 14.7327 20.9956 13.6364 24 13.6364C28.7236 13.6364 30 18.3491 30 21.2727V30H24.5455V21.2727C24.5455 20.1818 24 18 21.8182 18C20.2691 18 19.1782 19.0996 18.5455 20.1284V30H13.6364V13.6364Z" fill="currentColor"/></svg>',
    dribbble:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.6398 1.93288C4.85154 2.36466 4.14174 2.89274 3.51724 3.51724C2.10769 4.92679 1.18928 6.77097 0.76108 8.97093C4.59289 9.30647 8.15121 8.69576 11.1723 7.63273C9.77754 5.63606 7.98066 3.70641 5.69543 1.9779C5.67625 1.96341 5.65771 1.94839 5.6398 1.93288ZM0.505065 11.0995C0.488666 11.4115 0.480469 11.729 0.480469 12.0519C0.480469 14.7758 1.06386 17.1169 2.23189 18.9728C5.8127 15.7529 9.38245 13.8373 12.9856 12.8576C13.2749 12.779 13.5641 12.7064 13.8531 12.6398C13.4436 11.5944 12.9452 10.5371 12.3457 9.48686C8.92845 10.7586 4.87297 11.4938 0.505065 11.0995ZM3.57679 20.6456C5.59981 22.6316 8.50057 23.6233 12.0519 23.6233C13.2036 23.6233 14.2869 23.5191 15.294 23.3103C15.2942 23.2596 15.2979 23.2081 15.3055 23.1565C15.6234 20.9909 15.5035 17.9593 14.5482 14.6798C14.2145 14.7531 13.881 14.8348 13.5478 14.9254C10.2745 15.8154 6.96731 17.5753 3.57679 20.6456ZM17.5261 22.6237C18.6972 22.1288 19.7233 21.4498 20.5866 20.5866C22.1396 19.0335 23.0964 16.9528 23.4582 14.45C21.1596 14.1437 18.9061 14.0646 16.6746 14.3246C17.545 17.4293 17.7382 20.3386 17.5261 22.6237ZM23.6216 12.3101C23.6228 12.2244 23.6233 12.1384 23.6233 12.0519C23.6233 8.72773 22.7545 5.97357 21.0145 3.97573C19.5682 5.57851 17.256 7.29575 14.3379 8.65435C15.0052 9.8519 15.5538 11.058 15.9982 12.2498C18.5463 11.907 21.0852 11.9802 23.6216 12.3101ZM19.4271 2.53634C17.5049 1.16524 15.003 0.480469 12.0519 0.480469C10.5554 0.480469 9.17437 0.656565 7.9259 1.00896C10.1095 2.80684 11.8466 4.78058 13.2108 6.81429C15.9762 5.5606 18.1374 3.96787 19.4271 2.53634Z" fill="currentColor"/></svg>',
    behance:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.9998 6.5V4.5H21.4998V6.5H14.9998ZM13.9258 9.797C14.8758 8.683 16.2658 8 17.9998 8C21.1028 8 22.9998 10.708 22.9998 13.5V15H15.7988C16.2458 15.86 17.0888 16.5 17.9998 16.5C18.9525 16.4913 19.8852 16.226 20.6998 15.732L22.1918 18.335C20.9438 19.07 19.4578 19.5 17.9998 19.5C16.5578 19.5 15.1858 18.831 14.1798 17.83C13.1758 16.828 12.4998 15.456 12.4998 14C12.4998 12.398 12.9828 10.901 13.9258 9.797ZM20.3628 12.5H15.2028C15.5888 11.192 16.6248 10.5 17.9998 10.5C19.2538 10.5 20.0598 11.355 20.3628 12.5ZM0.999847 5H6.74985C7.50113 4.99991 8.23901 5.19897 8.88832 5.57691C9.53762 5.95484 10.0751 6.49814 10.4461 7.15145C10.8171 7.80476 11.0082 8.54473 11.0001 9.29597C10.992 10.0472 10.7849 10.7829 10.3998 11.428C11.0885 11.9775 11.5894 12.7275 11.8331 13.5742C12.0769 14.4208 12.0515 15.3223 11.7605 16.1539C11.4694 16.9855 10.9271 17.7061 10.2086 18.216C9.49011 18.7258 8.6309 18.9998 7.74985 19H0.999847V5ZM3.99985 13V16.5H7.24985C7.71398 16.5 8.1591 16.3156 8.48728 15.9874C8.81547 15.6592 8.99985 15.2141 8.99985 14.75C8.99985 14.2859 8.81547 13.8408 8.48728 13.5126C8.1591 13.1844 7.71398 13 7.24985 13H3.99985ZM7.99985 9.25C7.99985 9.71413 7.81547 10.1592 7.48728 10.4874C7.1591 10.8156 6.71398 11 6.24985 11H3.99985V7.5H6.24985C7.21585 7.5 7.99985 8.284 7.99985 9.25Z" fill="currentColor"/></svg>',
  };

  /**
   * Round icon button, or a pill when given a label. Used by the CTA footer.
   * item: { icon: 'linkedin' | '<svg…>', label, href }
   */
  function socialButton(item) {
    var glyph = icons[item.icon] || item.icon || '';
    var body = item.label
      ? '<div class="h-14 lg:h-16 px-4 lg:px-5 bg-green-900 rounded-full flex items-center gap-2 text-[#BDF741]">' +
        '<span class="text-sm lg:text-base font-bold leading-normal">' +
        rich(item.label) +
        '</span>' +
        (glyph || ARROW_UP_RIGHT) +
        '</div>'
      : '<div class="size-14 lg:size-16 bg-green-900 rounded-full flex items-center justify-center text-[#BDF741]">' +
        glyph +
        '</div>';

    return (
      '<a href="' +
      esc(item.href || '#') +
      '" class="p-2.5 bg-green-900/10 rounded-full hover:bg-green-900/20 transition-colors"' +
      (item.title ? ' aria-label="' + esc(item.title) + '"' : '') +
      '>' +
      body +
      '</a>'
    );
  }

  /* ----------------------------------------------------------- components */

  var components = {};

  /**
   * Video/media ring beside a two-line heading. This is the row that repeats
   * at the top of every section.
   *
   * props: title, subtitle, video | image, align 'left'|'right', size, padded
   */
  components.sectionHeader = function (props) {
    props = props || {};
    var right = props.align === 'right';
    var ring = props.video || props.image ? mediaRing(props) : '';

    var heading =
      '<div class="' +
      cx('flex flex-col justify-center', right ? 'items-start lg:items-end lg:text-right' : 'items-start') +
      '">' +
      (props.title
        ? '<span class="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight lg:leading-[57.60px]">' +
          rich(props.title) +
          '</span>'
        : '') +
      (props.subtitle
        ? '<span class="text-zinc-400 text-3xl md:text-4xl lg:text-5xl font-normal leading-tight lg:leading-[57.60px]">' +
          rich(props.subtitle) +
          '</span>'
        : '') +
      '</div>';

    return (
      '<div class="' +
      cx(
        'self-stretch flex flex-wrap items-center gap-3',
        right ? 'lg:justify-end' : 'justify-start',
        props.padded === false ? '' : SECTION_X,
        props.class
      ) +
      '">' +
      (right ? heading + ring : ring + heading) +
      '</div>'
    );
  };

  /** Intro paragraph plus optional tag pills. */
  components.intro = function (props) {
    props = props || {};
    var tags = list(props.tags)
      .map(function (tag) {
        return typeof tag === 'string'
          ? tagPill(tag, { tone: props.tagTone })
          : tagPill(tag.label, { tone: tag.tone || props.tagTone, icon: tag.icon });
      })
      .join('');

    return section(
      '<div class="' + cx('self-stretch flex flex-col gap-6', SECTION_X) + '">' +
        (props.text
          ? '<p class="max-w-4xl text-green-900 text-lg md:text-xl lg:text-2xl font-normal leading-relaxed lg:leading-9">' +
            rich(props.text) +
            '</p>'
          : '') +
        (tags ? '<div class="flex flex-wrap items-center gap-2">' + tags + '</div>' : '') +
        '</div>',
      props
    );
  };

  /** Numbered problem/insight cards stacked full width.
   * Use variant 'compact' for the tighter single-line style shown in the second mockup.
   */
  components.problems = function (props) {
    props = props || {};
    var compact = props.variant === 'compact' || props.compact === true;

    var cards = list(props.items)
      .map(function (item, index) {
        if (compact) {
          var content = item.title && item.text ? item.title + ': ' + item.text : item.title || item.text || '';
          return (
            '<div class="self-stretch bg-white rounded-2xl outline outline-4 outline-offset-[-4px] outline-zinc-100 flex flex-col gap-2 px-3 py-3 lg:flex-row lg:items-center lg:gap-3 lg:px-4 lg:py-5">' +
            '<span class="w-auto shrink-0 text-center text-green-900 text-4xl font-normal leading-none lg:w-16 lg:text-8xl lg:leading-[81.60px]">' +
            (item.number || index + 1) +
            '</span>' +
            '<div class="flex-1 px-0 lg:px-4 lg:py-5">' +
            '<div class="self-stretch justify-center text-black text-base leading-6 lg:text-2xl lg:leading-9">' +
            rich(content) +
            '</div>' +
            '</div>' +
            '</div>'
          );
        }

        return (
          '<div class="self-stretch p-2 bg-white rounded-2xl outline outline-4 outline-offset-[-4px] outline-zinc-100 flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">' +
          '<span class="w-auto shrink-0 text-center text-green-900 text-4xl font-normal leading-none lg:w-16 lg:text-8xl lg:leading-[81.60px]">' +
          (item.number || index + 1) +
          '</span>' +
          '<div class="flex flex-col justify-center items-start gap-1">' +
          '<span class="text-black text-lg font-bold leading-snug lg:text-2xl lg:leading-9">' +
          rich(item.title) +
          '</span>' +
          '<span class="text-green-900/80 text-sm leading-normal lg:text-base">' +
          rich(item.text) +
          '</span>' +
          '</div>' +
          '</div>'
        );
      })
      .join('');

    return section('<div class="' + cx('self-stretch flex flex-col gap-3', SECTION_X) + '">' + cards + '</div>', props);
  };

  /** Grouped bullet lists — "what it is and how it works". */
  components.bullets = function (props) {
    props = props || {};
    var groups = list(props.groups)
      .map(function (group) {
        var items = list(group.items)
          .map(function (item) {
            return (
              '<li class="flex items-start gap-3">' +
              '<img class="size-5 mt-1.5 shrink-0" src="' +
              esc(props.bulletIcon || 'img/bullets.svg') +
              '" alt="" />' +
              '<span class="flex-1 text-green-900 text-base lg:text-lg font-normal leading-7">' +
              rich(item) +
              '</span>' +
              '</li>'
            );
          })
          .join('');

        return (
          '<div class="self-stretch flex flex-col gap-3">' +
          (group.title
            ? '<h3 class="text-black text-xl lg:text-2xl font-normal leading-9">' + rich(group.title) + '</h3>'
            : '') +
          '<ul class="flex flex-col gap-2">' +
          items +
          '</ul>' +
          '</div>'
        );
      })
      .join('');

    return section('<div class="' + cx('self-stretch flex flex-col gap-8', SECTION_X) + '">' + groups + '</div>', props);
  };

  /**
   * Cards with copy at the top and a screenshot anchored to the bottom.
   * props: items [{title, text, image}], columns 1|2|3, height
   */
  components.cardGrid = function (props) {
    props = props || {};
    var cols = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 xl:grid-cols-3' };
    var height = props.height || 'h-[420px] lg:h-[500px]';

    var cards = list(props.items)
      .map(function (item) {
        return (
          '<div class="' +
          cx('w-full relative bg-neutral-100 rounded-[32px] overflow-hidden', height) +
          '">' +
          '<div class="absolute left-6 top-8 right-6 px-3 flex flex-col justify-start items-start gap-2">' +
          '<h3 class="text-black text-xl lg:text-2xl font-bold leading-9">' +
          rich(item.title) +
          '</h3>' +
          (item.text
            ? '<p class="text-green-900/80 text-base lg:text-lg leading-7">' + rich(item.text) + '</p>'
            : '') +
          '</div>' +
          (item.image
            ? '<img class="absolute bottom-0 right-0 w-full h-[260px] lg:h-[300px] object-contain object-right-bottom" src="' +
              esc(item.image) +
              '" alt="' +
              esc(item.title || '') +
              '" />'
            : '') +
          '</div>'
        );
      })
      .join('');

    return section(
      '<div class="' +
        cx('self-stretch grid grid-cols-1 gap-6', cols[props.columns] || cols[3], SECTION_X) +
        '">' +
        cards +
        '</div>',
      props
    );
  };

  /**
   * Before/after style comparison table.
   * props: columns [{ heading, rows: [], tone: 'lime'|'neutral', icon }]
   */
  components.comparison = function (props) {
    props = props || {};

    var columnToneStyles = {
      neutral: {
        outer: 'bg-neutral-950 rounded-3xl text-white outline outline-1 outline-offset-[-1px] outline-gray-200',
        heading: 'text-white border-white',
        row: 'border-white text-white',
        rowText: 'text-white',
      },
      lime: {
        outer: 'bg-lime-400 rounded-3xl text-green-900 outline outline-1 outline-offset-[-1px] outline-gray-200',
        heading: 'text-green-900 border-green-900',
        row: 'border-green-900 text-green-900',
        rowText: 'text-green-900',
      },
      dark: {
        outer: 'bg-green-900 rounded-3xl text-white outline outline-1 outline-offset-[-1px] outline-gray-200',
        heading: 'text-white border-lime-400',
        row: 'border-lime-400 text-white',
        rowText: 'text-white',
      },
      light: {
        outer: 'bg-neutral-100 rounded-[20px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)] text-green-900 outline outline-1 outline-offset-[-1px] outline-gray-200',
        heading: 'text-black border-stone-300',
        row: 'border-gray-200 text-green-900',
        rowText: 'text-black',
      },
    };

    var columns = list(props.columns)
      .map(function (column) {
        var tone = column.tone || 'light';
        var styles = columnToneStyles[tone] || columnToneStyles.light;

        var rows = list(column.rows)
          .map(function (row) {
            return (
              '<div class="self-stretch min-h-20 px-5 lg:px-7 border-b-[0.50px] ' +
              styles.row +
              ' flex justify-start items-center gap-2">' +
              (column.icon
                ? '<img class="size-3.5 shrink-0" src="' + esc(column.icon) + '" alt="" />'
                : '') +
              '<span class="' +
              styles.rowText +
              ' text-sm lg:text-base leading-snug">' +
              rich(row) +
              '</span>' +
              '</div>'
            );
          })
          .join('');

        return (
          '<div class="' +
          cx(
            'flex-1 min-w-[12rem] lg:min-w-48 flex flex-col justify-start items-start overflow-hidden',
            styles.outer
          ) +
          '">' +
          '<div class="self-stretch min-h-24 px-5 lg:px-7 py-6 border-b flex justify-center items-center text-center ' + styles.heading + '">' +
          '<span class="block w-full text-lg lg:text-[22px] font-medium leading-7">' +
          rich(column.heading) +
          '</span>' +
          '</div>' +
          rows +
          '</div>'
        );
      })
      .join('');

    return section(
      '<div class="' + cx('self-stretch overflow-x-auto w-full overflow-y-visible', SECTION_X) + '">' +
        '<div class="min-w-[720px] w-full flex justify-start items-stretch gap-0 rounded-[20px]">' +
        columns +
        '</div>' +
        '</div>',
      props
    );
  };

  /**
   * Big numbered items — used for key features and lessons learned.
   * props: items [{title, text}], variant 'columns' | 'stacked'
   */
  components.numbered = function (props) {
    props = props || {};
    var stacked = props.variant === 'stacked';
    var columnCount = Number(props.columns) || 1;
    var columnClasses = {
      1: 'grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 xl:grid-cols-3',
    };

    var items = list(props.items)
      .map(function (item, index) {
        return (
          '<div class="' +
          cx(
            'pr-6 pt-8 lg:pt-14 pb-5 border-t border-gray-200 flex justify-start items-start gap-6',
            stacked ? 'self-stretch flex-row' : 'flex-col lg:gap-14'
          ) +
          '">' +
          '<span class="shrink-0 text-green-900 text-4xl lg:text-7xl font-normal leading-none lg:leading-[80px]">' +
          (item.number || pad(index)) +
          '</span>' +
          '<div class="flex-1 flex flex-col gap-2">' +
          (item.title
            ? '<h3 class="text-black text-xl lg:text-3xl font-normal leading-snug lg:leading-10">' +
              rich(item.title) +
              '</h3>'
            : '') +
          (item.text
            ? '<p class="text-neutral-600 text-base lg:text-xl font-normal leading-7 lg:leading-8">' +
              rich(item.text) +
              '</p>'
            : '') +
          '</div>' +
          '</div>'
        );
      })
      .join('');

    return section(
      '<div class="' +
        cx(
          'self-stretch gap-x-6',
          stacked ? 'flex flex-col' : 'grid',
          stacked ? '' : columnClasses[columnCount] || columnClasses[1],
          SECTION_X
        ) +
        '">' +
        items +
        '</div>',
      props
    );
  };

  /** Testimonial cards. */
  components.quotes = function (props) {
    props = props || {};
    var cards = list(props.items)
      .map(function (item) {
        return (
          '<figure class="' +
          cx(
            'flex-1 min-w-72 px-8 py-10 rounded-3xl flex flex-col justify-start items-start gap-4',
            props.tone === 'neutral' ? 'bg-neutral-100' : 'bg-lime-400'
          ) +
          '">' +
          '<blockquote class="self-stretch text-green-900 text-xl lg:text-3xl font-normal leading-snug lg:leading-[48px]">' +
          rich(item.quote || item.text) +
          '</blockquote>' +
          (item.author
            ? '<figcaption class="text-green-900/70 text-base lg:text-xl font-medium">' +
              rich(item.author) +
              '</figcaption>'
            : '') +
          '</figure>'
        );
      })
      .join('');

    return section(
      '<div class="' + cx('self-stretch flex flex-wrap justify-start items-stretch gap-6', SECTION_X) + '">' +
        cards +
        '</div>',
      props
    );
  };

  /** One or more full-width frames/screenshots. */
  components.banner = function (props) {
    props = props || {};
    var imageHeight = props.height || 'h-auto';
    var images = list(props.images || props.image)
      .map(function (image) {
        var src = typeof image === 'string' ? image : image.src;
        var alt = typeof image === 'string' ? '' : image.alt || '';
        return (
          '<img class="w-full rounded-3xl lg:rounded-[32px] object-cover object-center ' +
            esc(imageHeight) +
            '" src="' +
            esc(src) +
            '" alt="' +
            esc(alt) +
            '" />'
        );
      })
      .join('');

    var content = '';
    if (props.content) {
      if (Array.isArray(props.content)) {
        content =
          '<div class="self-stretch flex flex-col gap-3 text-green-900/80 text-base lg:text-lg leading-7">' +
          props.content
            .map(function (item) {
              return '<p>' + rich(item) + '</p>';
            })
            .join('') +
          '</div>';
      } else {
        content = '<div class="self-stretch text-green-900/80 text-base lg:text-lg leading-7">' + rich(props.content) + '</div>';
      }
    }

    return section(
      '<div class="' +
        cx(
          'self-stretch grid grid-cols-1 gap-6',
          props.columns === 2 ? 'md:grid-cols-2' : props.columns === 3 ? 'md:grid-cols-3' : '',
          SECTION_X
        ) +
        '">' +
        images +
        (content ? '<div class="self-stretch">' + content + '</div>' : '') +
        '</div>',
      props
    );
  };

  /** Image gallery with a caption under each frame. */
  components.gallery = function (props) {
    props = props || {};
    var cards = list(props.items)
      .map(function (item) {
        return (
          '<figure class="flex flex-col gap-4">' +
          '<div class="w-full h-[280px] lg:h-[360px] bg-neutral-100 rounded-3xl overflow-hidden">' +
          '<img class="w-full h-full object-cover object-center" src="' +
          esc(item.image) +
          '" alt="' +
          esc(item.title || '') +
          '" />' +
          '</div>' +
          (item.title || item.text
            ? '<figcaption class="flex flex-col gap-1">' +
              (item.title
                ? '<span class="text-black text-lg lg:text-2xl font-bold leading-snug">' + rich(item.title) + '</span>'
                : '') +
              (item.text
                ? '<span class="text-green-900/80 text-base leading-normal">' + rich(item.text) + '</span>'
                : '') +
              '</figcaption>'
            : '') +
          '</figure>'
        );
      })
      .join('');

    var cols = { 1: '', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' };
    return section(
      '<div class="' + cx('self-stretch grid grid-cols-1 gap-6', cols[props.columns] || cols[3], SECTION_X) + '">' +
        cards +
        '</div>',
      props
    );
  };

  /** Feature blocks with a heading and a nested checklist. */
  components.features = function (props) {
    props = props || {};
    var blocks = list(props.items)
      .map(function (item) {
        var lines = list(item.items)
          .map(function (line) {
            return (
              '<li class="flex items-start gap-2">' +
              '<span class="mt-2 size-2 shrink-0 rounded-full bg-green-900"></span>' +
              '<span class="flex-1 text-green-900 text-base lg:text-lg leading-7">' +
              rich(line) +
              '</span>' +
              '</li>'
            );
          })
          .join('');

        return (
          '<div class="flex-1 min-w-72 p-8 bg-neutral-100 rounded-3xl flex flex-col gap-4">' +
          '<h3 class="text-black text-xl lg:text-2xl font-bold leading-snug">' +
          rich(item.title) +
          '</h3>' +
          (item.text ? '<p class="text-green-900/80 text-base leading-normal">' + rich(item.text) + '</p>' : '') +
          (lines ? '<ul class="flex flex-col gap-2">' + lines + '</ul>' : '') +
          '</div>'
        );
      })
      .join('');

    return section(
      '<div class="' + cx('self-stretch flex flex-wrap items-stretch gap-6', SECTION_X) + '">' + blocks + '</div>',
      props
    );
  };

  /** Hero: brand pills, oversized title, optional stats and links. */
  components.hero = function (props) {
    props = props || {};

    var brand =
      props.brand || props.brandAccent
        ? '<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">' +
          (props.brand
            ? '<div class="flex items-center gap-1.5 pl-3 pr-5 lg:pr-8 py-2 bg-stone-950/5 rounded-full w-fit">' +
              (props.brandImage
                ? '<img class="h-10 lg:h-14 w-auto object-contain shrink-0" src="' + esc(props.brandImage) + '" alt="" />'
                : '') +
              '<span class="text-3xl lg:text-5xl font-normal leading-none">' +
              rich(props.brand) +
              '</span>' +
              '</div>'
            : '') +
          (props.brandAccent
            ? '<div class="flex items-center gap-1.5 px-2.5 py-2 bg-lime-300 rounded-full w-fit">' +
              (props.brandAccentImage
                ? '<div class="size-10 lg:size-14 rounded-full overflow-hidden shrink-0 bg-white"><img class="size-full object-cover object-center" src="' +
                  esc(props.brandAccentImage) +
                  '" alt="" /></div>'
                : '') +
              '<span class="text-3xl lg:text-5xl font-normal leading-none">' +
              rich(props.brandAccent) +
              '</span>' +
              (props.brandAccentImageEnd
                ? '<div class="size-10 lg:size-14 rounded-full overflow-hidden shrink-0 bg-white"><img class="size-full object-cover object-center" src="' +
                  esc(props.brandAccentImageEnd) +
                  '" alt="" /></div>'
                : '') +
              '</div>'
            : '') +
          '</div>'
        : '';

    var stats = list(props.stats).map(statCard).join('');
    var statsCount = list(props.stats).length;
    var statsGrid =
      statsCount === 1
        ? 'grid-cols-1 lg:grid-cols-1'
        : statsCount === 2
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
          : statsCount === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

    // A link row is an optional grey caption followed by the underlined link.
    var links = list(props.links)
      .map(function (link) {
        return (
          '<div class="flex items-center gap-2">' +
          (link.caption
            ? '<span class="text-stone-500 text-base font-normal leading-5">' + rich(link.caption) + '</span>'
            : '') +
          '<a class="inline-flex items-center gap-1 text-green-900 text-base font-normal underline leading-5 hover:text-green-700 transition-colors" href="' +
          esc(link.href || '#') +
          '"' +
          (link.external === false ? '' : ' target="_blank" rel="noopener noreferrer"') +
          '>' +
          rich(link.label) +
          ARROW_UP_RIGHT +
          '</a>' +
          '</div>'
        );
      })
      .join('');

    var tagline =
      props.tagline || props.taglineSub || props.video
        ? components.sectionHeader({
            title: props.tagline,
            subtitle: props.taglineSub,
            video: props.video,
            image: props.videoPoster,
            align: props.mediaAlign || 'right',
            padded: false,
          })
        : '';

    return (
      '<section class="' +
      cx('w-full flex flex-col justify-start items-start gap-8 lg:gap-10 pt-10 pb-8 lg:pt-20 lg:pb-10', SECTION_X) +
      '">' +
      '<div class="flex flex-col gap-3 lg:gap-4">' +
      brand +
      (props.title
        ? '<h1 class="text-5xl sm:text-7xl lg:text-9xl font-normal leading-tight lg:leading-[1.1]">' +
          rich(props.title) +
          '</h1>'
        : '') +
      (props.subtitle
        ? '<p class="text-zinc-400 text-2xl lg:text-4xl font-normal leading-tight">' + rich(props.subtitle) + '</p>'
        : '') +
      '</div>' +
      tagline +
      (stats
        ? '<div class="self-stretch grid ' + statsGrid + ' gap-3 lg:gap-4">' + stats + '</div>'
        : '') +
      (links
        ? '<div class="self-stretch flex flex-col gap-3 md:flex-row md:justify-end md:items-center md:gap-6">' +
          links +
          '</div>'
        : '') +
      '</section>'
    );
  };

  /** Closing call to action. */
  components.cta = function (props) {
    props = props || {};
    return (
      '<section class="w-full px-4 py-10 lg:p-24">' +
      '<div class="w-full bg-[#F5F5F5] rounded-3xl px-4 py-12 lg:py-24 flex flex-col gap-6 lg:gap-8">' +
      '<div class="flex flex-col items-center gap-3 text-center lg:px-24">' +
      (props.image || props.video ? mediaRing({ image: props.image, video: props.video }) : '') +
      (props.title
        ? '<h2 class="text-3xl lg:text-5xl font-normal leading-tight lg:leading-[1.15]">' + rich(props.title) + '</h2>'
        : '') +
      (props.subtitle
        ? '<p class="text-zinc-400 text-3xl lg:text-5xl font-normal leading-tight lg:leading-[1.15]">' +
          rich(props.subtitle) +
          '</p>'
        : '') +
      '</div>' +
      (props.buttonText
        ? '<div class="flex justify-center">' +
          '<div class="w-full max-w-xl lg:w-auto lg:max-w-none flex items-center justify-between lg:justify-center gap-2 lg:gap-1.5 px-2.5 py-2 bg-[#BDF741] rounded-full">' +
          (props.buttonImage
            ? '<div class="size-10 lg:size-14 rounded-full overflow-hidden shrink-0 bg-white"><img class="size-full object-cover" src="' +
              esc(props.buttonImage) +
              '" alt="" /></div>'
            : '') +
          '<a href="' +
          esc(props.buttonHref || '#') +
          '" class="text-green-900 text-base sm:text-xl lg:text-4xl font-normal truncate lg:leading-[48px]">' +
          rich(props.buttonText) +
          '</a>' +
          (props.buttonImageEnd
            ? '<div class="size-10 lg:size-14 rounded-full overflow-hidden shrink-0 bg-white"><img class="size-full object-cover" src="' +
              esc(props.buttonImageEnd) +
              '" alt="" /></div>'
            : '') +
          '</div>' +
          '</div>'
        : '') +
      (list(props.socials).length
        ? '<div class="flex flex-wrap justify-center gap-4 lg:gap-6 lg:px-24">' +
          list(props.socials).map(socialButton).join('') +
          '</div>'
        : '') +
      '</div>' +
      '</section>'
    );
  };

  /* -------------------------------------------------------------- renderer */

  // A section entry may name a component directly, or pair a sectionHeader
  // with a body component via `header`.
  function renderSection(entry) {
    if (typeof entry === 'string') return entry;
    if (!entry || !entry.type) return '';

    var component = components[entry.type];
    if (!component) {
      console.warn('[CaseStudy] unknown section type:', entry.type);
      return '';
    }

    var header = entry.header ? components.sectionHeader(entry.header) : '';
    var body = component(entry);
    if (!header) return body;

    return (
      '<section class="w-full flex flex-col justify-start items-start gap-6 lg:gap-8">' + header + body + '</section>'
    );
  }

  /**
   * Turn a flat config (title/intro/tags/problem/features/gallery/cta) into a
   * section list, so simple pages don't have to spell out every section.
   */
  function sectionsFromFlatConfig(config) {
    var sections = [];

    sections.push({
      type: 'hero',
      brand: config.brand,
      brandAccent: config.brandAccent,
      brandImage: config.brandImage,
      brandAccentImage: config.brandAccentImage,
      brandAccentImageEnd: config.brandAccentImageEnd,
      title: config.title,
      subtitle: config.subtitle,
      tagline: config.tagline,
      taglineSub: config.taglineSub,
      video: config.video,
      stats: config.stats,
      links: config.links,
    });

    if (config.intro || config.tags) {
      sections.push({ type: 'intro', text: config.intro, tags: config.tags });
    }
    if (config.problem) {
      sections.push({
        type: 'problems',
        items: config.problem,
        header: { title: 'Problem', subtitle: 'What was in the way', video: config.headerVideo },
      });
    }
    if (config.features) {
      sections.push({
        type: 'features',
        items: config.features,
        header: { title: 'Solution', subtitle: 'What we built', video: config.headerVideo },
      });
    }
    if (config.results) {
      sections.push({
        type: 'comparison',
        columns: config.results,
        header: { title: 'Results', subtitle: 'Outcome metrics', video: config.headerVideo },
      });
    }
    if (config.gallery) {
      sections.push({
        type: 'gallery',
        items: config.gallery,
        header: { title: 'Frames', subtitle: 'Some of the screens', video: config.headerVideo },
      });
    }
    if (config.quotes) {
      sections.push({
        type: 'quotes',
        items: config.quotes,
        header: { title: 'Reviews', subtitle: 'What the team said', video: config.headerVideo },
      });
    }
    if (config.lessons) {
      sections.push({
        type: 'numbered',
        items: config.lessons,
        header: { title: 'Lessons', subtitle: 'After implementation', video: config.headerVideo },
      });
    }
    if (config.cta) {
      sections.push(Object.assign({ type: 'cta' }, config.cta));
    }

    return sections;
  }

  function html(config) {
    config = config || {};
    var sections = config.sections || sectionsFromFlatConfig(config);
    return (
      '<div class="w-full flex flex-col ' +
      (config.sectionGap || 'gap-16 lg:gap-28') +
      '">' +
      sections.map(renderSection).join('') +
      '</div>'
    );
  }

  function render(config, target) {
    var mount =
      typeof target === 'string'
        ? document.querySelector(target)
        : target || document.getElementById('case-study-root');
    if (!mount) {
      console.warn('[CaseStudy] no mount element found');
      return null;
    }
    mount.innerHTML = html(config);
    return mount;
  }

  var CaseStudy = {
    components: components,
    icons: icons,
    primitives: {
      mediaRing: mediaRing,
      tagPill: tagPill,
      statCard: statCard,
      socialButton: socialButton,
    },
    html: html,
    render: render,
    section: renderSection,
  };

  global.CaseStudy = CaseStudy;

  // Auto-render when a page just declares `window.caseStudyConfig`.
  function boot() {
    if (global.caseStudyConfig && document.getElementById('case-study-root')) {
      render(global.caseStudyConfig);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
