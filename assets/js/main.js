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
   * From a youtube tutorial for resusable event listeners
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
  
  
  // COULDN'T FIGURE OUT THE USE
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
  
  // /**
  //  * Mobile nav dropdowns activate
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
  
  // /**
  //  * Skills animation
  //  */
  // let skilsContent = select('.skills-content');
  // if (skilsContent) {
  //   new Waypoint({
  //     element: skilsContent,
  //     offset: '80%',
  //     handler: function (direction) {
  //       let progress = select('.progress .progress-bar', true);
  //       progress.forEach((el) => {
  //         el.style.width = el.getAttribute('aria-valuenow') + '%'
  //       });
  //     }
  //   })
  // }
  
  // /**
  //  * Porfolio isotope and filter
  //  */
  // window.addEventListener('load', () => {
  //   let portfolioContainer = select('.portfolio-container');
  //   if (portfolioContainer) {
  //     let portfolioIsotope = new Isotope(portfolioContainer, {
  //       itemSelector: '.portfolio-item',
  //       layoutMode: 'fitRows'
  //     });
  
  //     let portfolioFilters = select('#portfolio-flters li', true);
  
  //     on('click', '#portfolio-flters li', function (e) {
  //       e.preventDefault();
  //       portfolioFilters.forEach(function (el) {
  //         el.classList.remove('filter-active');
  //       });
  //       this.classList.add('filter-active');
  
  //       portfolioIsotope.arrange({
  //         filter: this.getAttribute('data-filter')
  //       });
  //     }, true);
  //   }
  
  // });
  
  // /**
  //  * Initiate portfolio lightbox 
  //  */
  // const portfolioLightbox = GLightbox({
  //   selector: '.portfolio-lightbox'
  // });
  
  // /**
  //  * Portfolio details slider
  //  */
  // new Swiper('.portfolio-details-slider', {
  //   speed: 400,
  //   loop: true,
  //   autoplay: {
  //     delay: 5000,
  //     disableOnInteraction: false
  //   },
  //   pagination: {
  //     el: '.swiper-pagination',
  //     type: 'bullets',
  //     clickable: true
  //   }
  // });
  
//   /**
//    * Testimonials slider
//    */
//   new Swiper('.testimonials-slider', {
//     speed: 600,
//     loop: true,
//     autoplay: {
//       delay: 5000,
//       disableOnInteraction: false
//     },
//     slidesPerView: 'auto',
//     pagination: {
//       el: '.swiper-pagination',
//       type: 'bullets',
//       clickable: true
//     },
//     breakpoints: {
//       320: {
//         slidesPerView: 1,
//         spaceBetween: 20
//       },
  
//       1200: {
//         slidesPerView: 3,
//         spaceBetween: 20
//       }
//     }
//   });