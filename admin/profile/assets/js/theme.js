/**
=========================================================================
=========================================================================
Template Name: Light-able - Admin Template
Author: Phoenixcoded
Support: https://phoenixcoded.authordesk.app
File: themes.js
Description:  this file will contains overall theme setup and handle
              behavior of live custumizer like Dark/Light, LTR/RTL,
              preset color, theme layout, theme contarast etc.
=========================================================================
=========================================================================

*/

var rtl_flag = false;
var dark_flag = false;

function layout_change_default() {
  // Determine the initial layout based on the user's system preference for color scheme
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  let dark_layout = prefersDarkScheme.matches ? 'dark' : 'light';

  // Apply the initial layout
  layout_change(dark_layout);

  // Set the active class on the default theme button, if it exists
  const btn_control = document.querySelector('.theme-layout .btn[data-value="default"]');
  if (btn_control) {
    btn_control.classList.add('active');
  }

  // Listen for changes in the user's system color scheme preference
  prefersDarkScheme.addEventListener('change', (event) => {
    dark_layout = event.matches ? 'dark' : 'light';
    layout_change(dark_layout);
  });
}

// dark switch mode
function dark_mode() {
  const darkModeToggle = document.getElementById('dark-mode');

  // Ensure the element exists before proceeding
  if (!darkModeToggle) return;

  // Toggle between dark and light modes based on the checkbox status
  const mode = darkModeToggle.checked ? 'dark' : 'light';
  layout_change(mode);
}

// // preset color
document.addEventListener('DOMContentLoaded', function () {
  //   // Handle preset color changes
  const presetColors = document.querySelectorAll('.preset-color > a');
  if (presetColors.length) {
    presetColors.forEach((colorElement) => {
      colorElement.addEventListener('click', function (event) {
        let targetElement = event.target;

        // Traverse up to find the correct clickable element
        if (targetElement.tagName === 'SPAN') {
          targetElement = targetElement.parentNode;
        } else if (targetElement.tagName === 'IMG') {
          targetElement = targetElement.closest('a');
        }

        const presetValue = targetElement.getAttribute('data-value');
        preset_change(presetValue);
      });
    });
  }

  // Initialize SimpleBar if .pct-body exists
  const pctBody = document.querySelector('.pct-body');
  if (pctBody) {
    new SimpleBar(pctBody);
  }

  // Handle layout reset
  const layoutResetBtn = document.querySelector('#layoutreset');
  if (layoutResetBtn) {
    layoutResetBtn.addEventListener('click', () => location.reload());
  }
});

function layout_sidebar_change(value) {
  if (value == 'dark') {
    // Set the sidebar theme to 'dark'
    document.getElementsByTagName('body')[0].setAttribute('data-pc-sidebar-theme', 'dark');

    // Find the active button in the sidebar theme control and remove its active class
    var control = document.querySelector('.theme-sidebar-color .btn.active');
    if (control) {
      control.classList.remove('active'); // Remove active class from current button
    }
    if (document.querySelector('.pc-sidebar .m-header .logo-lg')) {
      document.querySelector('.pc-sidebar .m-header .logo-lg').setAttribute('src', '../assets/images/logo-white.svg');
    }

    // Add the active class to the button representing the dark theme
    var darkBtn = document.querySelector(".theme-sidebar-color .btn[data-value='true']");
    if (darkBtn) {
      darkBtn.classList.add('active'); // Set the active class for dark theme
    }
  } else {
    // Set the sidebar theme to 'light'
    document.getElementsByTagName('body')[0].setAttribute('data-pc-sidebar-theme', 'light');

    // Find the active button in the sidebar theme control and remove its active class
    var control = document.querySelector('.theme-sidebar-color .btn.active');
    if (control) {
      control.classList.remove('active'); // Remove active class from current button
    }
    if (document.querySelector('.pc-sidebar .m-header .logo-lg')) {
      document.querySelector('.pc-sidebar .m-header .logo-lg').setAttribute('src', '../assets/images/logo-dark.svg');
    }

    // Add the active class to the button representing the light theme
    var lightBtn = document.querySelector(".theme-sidebar-color .btn[data-value='false']");
    if (lightBtn) {
      lightBtn.classList.add('active'); // Set the active class for light theme
    }
  }
}

function layout_caption_change(value) {
  document.body.setAttribute('data-pc-sidebar-caption', value);
  var control = document.querySelector('.theme-nav-caption .btn.active');
  if (control) {
    control.classList.remove('active');
  }
  var newActive = document.querySelector(`.theme-nav-caption .btn[data-value='${value}']`);
  if (newActive) {
    newActive.classList.add('active');
  }
}

function preset_change(value) {
  const body = document.querySelector('body');
  const control = document.querySelector('.pct-offcanvas');

  // Set the 'data-pc-preset' attribute on the body
  body.setAttribute('data-pc-preset', value);

  // Update active state in the UI if control exists
  if (control) {
    const activeElement = document.querySelector('.preset-color > a.active');
    const newActiveElement = document.querySelector(`.preset-color > a[data-value='${value}']`);

    if (activeElement) {
      activeElement.classList.remove('active');
    }
    if (newActiveElement) {
      newActiveElement.classList.add('active');
    }
  }
}

function layout_rtl_change(value) {
  const body = document.querySelector('body');
  const html = document.querySelector('html');
  const directionControl = document.querySelector('.theme-direction .btn.active');
  const rtlBtn = document.querySelector(".theme-direction .btn[data-value='true']");
  const ltrBtn = document.querySelector(".theme-direction .btn[data-value='false']");

  if (value === 'true') {
    rtl_flag = true;
    body.setAttribute('data-pc-direction', 'rtl');
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');

    // Update active button state for RTL
    if (directionControl) directionControl.classList.remove('active');
    if (rtlBtn) rtlBtn.classList.add('active');
  } else {
    rtl_flag = false;
    body.setAttribute('data-pc-direction', 'ltr');
    html.removeAttribute('dir');
    html.removeAttribute('lang');

    // Update active button state for LTR
    if (directionControl) directionControl.classList.remove('active');
    if (ltrBtn) ltrBtn.classList.add('active');
  }
}

function layout_change(layout) {
  var control = document.querySelector('.pct-offcanvas');
  document.getElementsByTagName('body')[0].setAttribute('data-pc-theme', layout);

  var btn_control = document.querySelector('.theme-layout .btn[data-value="default"]');
  if (btn_control) {
    btn_control.classList.remove('active');
  }
  if (layout == 'dark') {
    dark_flag = true;
    if (document.querySelector('.pc-sidebar .m-header .logo-lg')) {
      document.querySelector('.pc-sidebar .m-header .logo-lg').setAttribute('src', '../assets/images/logo-white.svg');
    }

    if (document.querySelector('.navbar-brand .logo-lg')) {
      document.querySelector('.navbar-brand .logo-lg').setAttribute('src', '../assets/images/logo-white.svg');
    }
    if (document.querySelector('.landing-logo')) {
      document.querySelector('.landing-logo').setAttribute('src', 'assets/images/logo-white.svg');
    }
    if (document.querySelector('.auth-main.v1 .auth-sidefooter')) {
      document.querySelector('.auth-main.v1 .auth-sidefooter img').setAttribute('src', '../assets/images/logo-white.svg');
    }
    if (document.querySelector('.footer-top .footer-logo')) {
      document.querySelector('.footer-top .footer-logo').setAttribute('src', '../assets/images/logo-white.svg');
    }
    var control = document.querySelector('.theme-layout .btn.active');
    if (control) {
      document.querySelector('.theme-layout .btn.active').classList.remove('active');
      document.querySelector(".theme-layout .btn[data-value='false']").classList.add('active');
    }
  } else {
    dark_flag = false;
    if (document.querySelector('.pc-sidebar .m-header .logo-lg')) {
      document.querySelector('.pc-sidebar .m-header .logo-lg').setAttribute('src', '../assets/images/logo-dark.svg');
    }
    if (document.querySelector('.navbar-brand .logo-lg')) {
      document.querySelector('.navbar-brand .logo-lg').setAttribute('src', '../assets/images/logo-dark.svg');
    }

    if (document.querySelector('.landing-logo')) {
      document.querySelector('.landing-logo').setAttribute('src', 'assets/images/logo-dark.svg');
    }
    if (document.querySelector('.auth-main.v1 .auth-sidefooter')) {
      document.querySelector('.auth-main.v1 .auth-sidefooter img').setAttribute('src', '../assets/images/logo-dark.svg');
    }
    if (document.querySelector('.footer-top .footer-logo')) {
      document.querySelector('.footer-top .footer-logo').setAttribute('src', '../assets/images/logo-dark.svg');
    }
    var control = document.querySelector('.theme-layout .btn.active');
    if (control) {
      document.querySelector('.theme-layout .btn.active').classList.remove('active');
      document.querySelector(".theme-layout .btn[data-value='true']").classList.add('active');
    }
  }
}

function change_box_container(value) {
  // Check if the .pc-content element exists
  if (document.querySelector('.pc-content')) {
    // If value is 'true', switch to boxed layout
    if (value == 'true') {
      // Add 'container' class to the content and footer, remove 'container-fluid' from the footer
      document.querySelector('.pc-content').classList.add('container');
      document.querySelector('.footer-wrapper').classList.add('container');
      document.querySelector('.footer-wrapper').classList.remove('container-fluid');

      // Update the active button for the boxed layout option
      var control = document.querySelector('.theme-container .btn.active');
      if (control) {
        control.classList.remove('active');
        document.querySelector(".theme-container .btn[data-value='true']").classList.add('active');
      }
    }
    // If value is not 'true', switch to full-width layout
    else {
      // Remove 'container' class and add 'container-fluid' to the footer
      document.querySelector('.pc-content').classList.remove('container');
      document.querySelector('.footer-wrapper').classList.remove('container');
      document.querySelector('.footer-wrapper').classList.add('container-fluid');

      // Update the active button for the full-width layout option
      var control = document.querySelector('.theme-container .btn.active');
      if (control) {
        control.classList.remove('active');
        document.querySelector(".theme-container .btn[data-value='false']").classList.add('active');
      }
    }
  }
}
