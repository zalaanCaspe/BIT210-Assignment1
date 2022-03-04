/**
* Returns first occurence of an element (or all if parameter is true)
*/
const select = (el, all = false) => {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

/**
 * Reusable event listeners
 * Used mainly on homepage to offset auto-scroll and activate burger menu on mobile
 * Parameters explained:
 *        type: the type of event that triggers the function (click, load etc)
 *          el: the element(s) to add event listeners to
 *    listener: the function that acts as the custom listener
 *         all: determines whether to add listener to all elements or first occurence
 */
const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all)
  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener))
    } else {
      selectEl.addEventListener(type, listener)
    }
  }
}

/**
 * Reusable on scroll event listener 
 */
const onscroll = (el, listener) => {
  el.addEventListener('scroll', listener)
}

/**
 * To activate navbar links on scroll on homepage
 * Navbar contains multiple links to the homepage
 * This shows which section the user is on
 * 
 * for each link on the navbar:
 *    - if it's not an anchor tag, skip
 *    - if it's not a section, skip
 *    - if current position is below the topmost part of the section but above the lowermost part (ie we are ON the section)
 *        - set the section link on navbar to active
 *    - else remove active class
 */
let navbarlinks = select('#navbar .scrollto', true)  // Select all navbar links
const navbarlinksActive = () => {
  let position = window.scrollY + 200
  navbarlinks.forEach(navbarlink => {
    if (!navbarlink.hash) return
    let section = select(navbarlink.hash)
    if (!section) return
    if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
      navbarlink.classList.add('active')
    } else {
      navbarlink.classList.remove('active')
    }
  })
}
window.addEventListener('load', navbarlinksActive)
onscroll(document, navbarlinksActive)

/**
 * Definition of the scrollto function which lets page scroll to homepage element with offset
 * Without this, on auto-scroll, the section header would be hidden behind navbar
 */
const scrollto = (el) => {
  let header = select('#header')
  let offset = header.offsetHeight // returns pixel height of an element (exludign margin)

  let elementPos = select(el).offsetTop // returns top position relative to parent
  // sets the scrolling css to be smooth rather than a straight jump
  window.scrollTo({
    top: elementPos - offset,
    behavior: 'smooth'
  })
}


// // COULDN'T FIGURE OUT THE USE
// /**
//  * Toggle .header-scrolled class to #header when page is scrolled
//  */
// let selectHeader = select('#header')
// if (selectHeader) {
//   const headerScrolled = () => {
//     if (window.scrollY > 100) {
//       selectHeader.classList.add('header-scrolled')
//     } else {
//       selectHeader.classList.remove('header-scrolled')
//     }
//   }
//   window.addEventListener('load', headerScrolled)
//   onscroll(document, headerScrolled)
// }

/**
 * Back to top button
 */
let backtotop = select('.back-to-top')
if (backtotop) {
  const toggleBacktotop = () => {
    if (window.scrollY > 100) {
      backtotop.classList.add('active')
    } else {
      backtotop.classList.remove('active')
    }
  }
  window.addEventListener('load', toggleBacktotop)
  onscroll(document, toggleBacktotop)
}

/**
 * activate the responsive navbar by adding the navbar-mobile class to the navbar
 */
on('click', '.mobile-nav-toggle', function (e) {
  select('#navbar').classList.toggle('navbar-mobile')
  this.classList.toggle('bi-list')
  this.classList.toggle('bi-x')
})

// COMMENTED OUT BECAUSE WE DON'T HAVE DROPDOWN IN NAVBAR
// /**
//  * Mobile nav dropdowns activate
//  * Similar to previous event listener but for the dropdown in navbar
//  */
//  on('click', '.navbar .dropdown > a', function (e) {
//   if (select('#navbar').classList.contains('navbar-mobile')) {
//     e.preventDefault()
//     this.nextElementSibling.classList.toggle('dropdown-active')
//   }
// }, true)

/**
 * Scrool with ofset on links with a class name .scrollto
 * Event listener to scroll to the right section (containing .scrollto class) on homepage
 * Steps:
 *      - select navbar
 *      - if navbar has .navbar-mobile class (i.e navbar was opened in mobile mode)
 *            - remove the navbar-mobile class (ie close the navbar popup)
 *            - show the list icon (it is hidden when popup is active)
 *            - hide the popup cross icon (now that the popup is closed)
 *      - activate scrollto to scroll to the clicked element
 */
on('click', '.scrollto', function (e) {
  if (select(this.hash)) {
    e.preventDefault()

    let navbar = select('#navbar')
    // if screen in mobile mode
    if (navbar.classList.contains('navbar-mobile')) {
      navbar.classList.remove('navbar-mobile')
      let navbarToggle = select('.mobile-nav-toggle')
      navbarToggle.classList.toggle('bi-list')
      navbarToggle.classList.toggle('bi-x')
    }
    scrollto(this.hash)
  }
}, true)

/**
 * Activates function on homepage 
 * to offset the scroll to show the section headers
 */
window.addEventListener('load', () => {
  if (window.location.hash) {
    if (select(window.location.hash)) {
      scrollto(window.location.hash)
    }
  }
});

/**
 * Skills animation
 * Uses Waypoint package, which helps trigger a 
 * function when page is scrolled to a specific element
 * In this case, it's the skills-content class.
 * Offset of 80% lets the element scroll to when it's 80% from the top
 * otherwise, it would trigger the function as soon as the element appears
 * How the passed function works:
 * - get the progress bar elements
 * - gets each element's hardcoded progress and sets it as the width of the element
 */
let skillsContent = select('.skills-content');
if (skillsContent) {
  new Waypoint({
    element: skillsContent,
    offset: '80%',
    handler: function (direction) {
      let progress = select('.progress .progress-bar', true);
      progress.forEach((el) => {
        el.style.width = el.getAttribute('aria-valuenow') + '%'
      });
    }
  })
}

/**
 * If #counts id exists, create PureCounter object
 * PureCounter is a library that allows counting animations by 
 * specifying html attributes for starting value, ending value and duration in the html file
 */
let count = select('#counts', true)
if (count) {
  new PureCounter();
}

/**
 * Porfolio isotope and filter
 * Portfolios are filterable cards with images
 * Steps:
 * - Create isotope object (js library to allow filtering and sorting)
 * - Get the filter categories
 * - If a filter category is clicked
 *    - Mark all other categoriez as inactive
 *    - Mark clicked category as active
 *    - Use isotope package to filter matching portfolio items
 */
window.addEventListener('load', () => {
  let portfolioContainer = select('.portfolio-container');
  if (portfolioContainer) {
    let portfolioIsotope = new Isotope(portfolioContainer, {
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    let portfolioFilters = select('#portfolio-flters li', true);

    on('click', '#portfolio-flters li', function (e) {
      e.preventDefault();
      portfolioFilters.forEach(function (el) {
        el.classList.remove('filter-active');
      });
      this.classList.add('filter-active');

      portfolioIsotope.arrange({
        filter: this.getAttribute('data-filter')
      });
    }, true);
  }

});

function searchFilter() {
  var searchRegex; // To hold the value entered in the search field

  // create Isotope to 
  // filter portfolio-items in the portfolio-container
  // by matching search input with item labels
  var searchIsotope = new Isotope('.portfolio-container', {
    itemSelector: '.portfolio-item',
    layoutMode: 'fitRows',
    filter: function (portfolioItem) {
      return searchRegex ? portfolioItem.textContent.match(searchRegex) : true;
    },
  });

  // get input field, add event listener to get input value on every keyup
  var searchInput = document.querySelector('.searchFilter');
  searchInput.addEventListener('keyup', debounce(function () {
    searchRegex = new RegExp(searchInput.value, 'gi');
    searchIsotope.arrange();
  }, 200));

  // debounce so filtering doesn't happen every millisecond
  function debounce(fn, threshold) {
    var timeout;
    threshold = threshold || 100;
    return function debounced() {
      clearTimeout(timeout);
      var args = arguments;
      var _this = this;
      function delayed() {
        fn.apply(_this, args);
      }
      timeout = setTimeout(delayed, threshold);
    };
  }

}

/**
 * Initiate portfolio lightbox 
 * The lightbox package allows images links to be displayed
 * over a page as a slideshow instead of going to the image file itself
 * (Better explained visually)
 */
const portfolioLightbox = GLightbox({
  selector: '.portfolio-lightbox'
});

/**
 * Portfolio details slider (Specific appeals slideshow)
 * Uses Swiper bundle to create auto sliding slideshow
 */
new Swiper('.portfolio-details-slider', {
  speed: 400,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  }
});

/**
 * Testimonials slider
 * Also uses Swiper bundle
 * breakpoints refers to different screen sizes
 * slidesPerView refers to how many slides will be shown in that screen size (at one time)
 * spaceBetween is the space between 2 slides
 */
new Swiper('.testimonials-slider', {
  speed: 600,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  slidesPerView: 'auto',
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20
    },

    1200: {
      slidesPerView: 3,
      spaceBetween: 20
    }
  }
});

/**
 * Applies DataTables library (js and css) to tables with id sortable-table
 * - Allows filtering and sorting of tables
 * - Uses custom attribute data-table-for to determine what the table is for
 *      (used to display appropriate error)
 */
let sortableTable = select('#sortable-table');
if (sortableTable) {
  var zeroMessage = sortableTable.getAttribute('data-table-for') + " does not exist";
  let table = new DataTable('#sortable-table', {
    language: {
      zeroRecords: zeroMessage,
      infoFiltered: "(_MAX_ total entries)"
    },
    order: []
  });
}

/**
 * To set visibility for "Add" buttons
 * Triggered if element with id="waypoint" exists
 * creates a Waypoint object which is an easy way to trigger specific functions
 * First, the button is retrieved
 * If the user scrolls down to the element
 * The button is set to be visible (class="active")
 * otherwise, it is made to be invisible
 */
let trigger = select('#waypoint');
if (trigger) {
  let btn = document.getElementsByClassName('add-btn')[0];
  var waypoint = new Waypoint({
    element: document.getElementById('waypoint'),
    handler: function(direction) {
      if (direction == 'down') {
        btn.classList.add('active')
      }
      else {
        btn.classList.remove('active')
      }
    },
    offset: 500
  })
}