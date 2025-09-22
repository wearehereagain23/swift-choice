// ===== Init Firebase =====
firebase.initializeApp(CONFIG.FIREBASE);
const auth = firebase.auth();
const db = firebase.firestore();

let dataBase = null;                 // local snapshot of users/{uid}
let unsubscribeNotifications = null; // unsubscribe function for notifications
let unsubscribeUserDoc = null;       // unsubscribe for user doc
let adminPass = null;




function formatCurrency(amount, locale = 'en-US') {
  return new Intl.NumberFormat(locale).format(amount);
}

// ===== Helpers =====
function showSpinnerModal() {
  const el = document.getElementById('spinnerModal');
  if (el) el.style.display = 'flex';
}
function hideSpinnerModal() {
  const el = document.getElementById('spinnerModal');
  if (el) el.style.display = 'none';
}

async function signOutUser() {
  try {
    await auth.signOut();
    console.log("✅ User logged out");
    function isInPWA() {
      if (window.matchMedia('(display-mode: standalone)').matches) return true;
      if (window.navigator.standalone === true) return true;
      return false;
    }
    if (isInPWA()) window.location.href = "../app.html";
    else window.location.href = "../index.html";
  } catch (err) {
    console.error("❌ Logout failed:", err);
  }
}

// UI refs (assumes these IDs exist in your HTML)
const notifyBtn = document.getElementById('notifyBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const notificationList = document.getElementById('notificationList');
const noteCounteEl = document.getElementById('noteCounte'); // badge element

// ===== Badge update =====
// Always show the numeric value (even 0)
function updateBadge(count) {
  if (!noteCounteEl) return;
  const num = (typeof count === 'string') ? parseInt(count, 10) : Number(count);
  noteCounteEl.textContent = isNaN(num) ? '0' : String(num);
}

// ===== Reset count to zero (writes to users doc only if needed) =====
async function resetNotificationCountToZero() {
  if (!dataBase || !dataBase.id) return;
  try {
    // Avoid unnecessary writes if already 0
    const currentRaw = dataBase.notificationCount;
    const current = (typeof currentRaw === 'string') ? parseInt(currentRaw, 10) : Number(currentRaw);
    if (!isNaN(current) && current === 0) {
      updateBadge(0);
      return;
    }

    await db.collection('users').doc(dataBase.id).update({ notificationCount: 0 });
    // Optimistic UI update
    updateBadge(0);
    console.log("✅ notificationCount reset to 0");
  } catch (err) {
    console.error("Error resetting notificationCount:", err);
  }
}

// ===== Listen for auth state + user doc =====
showSpinnerModal();
auth.onAuthStateChanged(user => {
  // Cleanup previous listeners
  if (unsubscribeUserDoc) {
    unsubscribeUserDoc();
    unsubscribeUserDoc = null;
  }
  if (unsubscribeNotifications) {
    unsubscribeNotifications();
    unsubscribeNotifications = null;
  }

  // 🔒 No user detected
  if (!user) {
    console.log("⚠️ No user logged in");
    dataBase = null;
    if (notificationList) notificationList.innerHTML = "";
    if (noteCounteEl) noteCounteEl.textContent = "0";
    hideSpinnerModal();

    // ✅ Prevent accidental redirect during account deletion
    if (!window.deletionInProgress) {
      // Add a small delay to avoid conflicts with other async tasks
      setTimeout(() => {
        signOutUser(); // Redirect to home/login page
      }, 200);
    }
    return;
  }

  // === User is logged in: fetch their data ===
  unsubscribeUserDoc = db.collection('users').doc(user.uid).onSnapshot(doc => {
    if (!doc.exists) {
      console.warn("⚠️ No user data found for UID:", user.uid);
      if (!window.deletionInProgress) {
        setTimeout(() => {
          signOutUser();
        }, 200);
      }
      return;
    }

    dataBase = { id: doc.id, ...doc.data() };
    hideSpinnerModal();
    getter(dataBase);

    //COLOR CONTRL

    if (dataBase.accountLevel == "Mini") {
      document.documentElement.style.setProperty('--background', '#0b0036ff');
      document.documentElement.style.setProperty('--primary', '#342eff');
      document.documentElement.style.setProperty('--card', '#00094fff');
      document.documentElement.style.setProperty('--accent', '#161c30ff');
      document.documentElement.style.setProperty('--muted', '#161c30ff');
    } else if (dataBase.accountLevel == "Silver") {
      document.documentElement.style.setProperty('--background', '#1e002dff');
      document.documentElement.style.setProperty('--primary', '#ff2ef5');
      document.documentElement.style.setProperty('--card', '#120018');
      document.documentElement.style.setProperty('--accent', '#2b1630ff');
      document.documentElement.style.setProperty('--muted', '#2b1630ff');
    } else if (dataBase.accountLevel == "Gold") {
      document.documentElement.style.setProperty('--background', '#2c1c00ff');
      document.documentElement.style.setProperty('--primary', '#e6b800');
      document.documentElement.style.setProperty('--card', '#583e01ff');
      document.documentElement.style.setProperty('--accent', '#302616ff');
      document.documentElement.style.setProperty('--muted', '#936f34ff');
    } else if (dataBase.accountLevel == "Platinum") {
      document.documentElement.style.setProperty('--background', '#271900ff');
      document.documentElement.style.setProperty('--primary', '#110600');
      document.documentElement.style.setProperty('--card', '#000000');
      document.documentElement.style.setProperty('--accent', '#241f16ff');
      document.documentElement.style.setProperty('--muted', '#241f16ff');
    }
    else {

      document.documentElement.style.setProperty('--background', '#0a1011ff');
      document.documentElement.style.setProperty('--primary', '#1ea2bcff');
      document.documentElement.style.setProperty('--card', '#000000ff');
      document.documentElement.style.setProperty('--accent', '#386a70ff');
      document.documentElement.style.setProperty('--muted', '#132a2cff');
    }

    // Re-initialize EmailJS (or any other logic)

    // Init EmailJS
    (function () {
      emailjs.init("WGXf3gpfcajNLEtfI"); // <-- replace with your EmailJS public key
    })();

    const modal = document.getElementById("contactModal");
    const emailBtn = document.getElementById("emailBtn");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const form = document.getElementById("contactForm");

    emailBtn.onclick = () => modal.style.display = "flex";
    closeModal.onclick = () => modal.style.display = "none";
    cancelBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };



    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Send email via EmailJS

      const templateParams = {
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        name: dataBase.firstname,
        time: new Date().toLocaleString(),
      };

      emailjs.send("service_g44l2u8", "template_9dlfz0p", templateParams)
        .then(() => {
          Swal.fire({
            title: "✅ Message Sent!",
            html: `
          <p style="font-size:16px; color:white;">
            Thank you for contacting <strong>Customer Care</strong>.<br>
            Your message has been received and one of our support agents will get back to you shortly.<br><br>
            <em>We usually reply within 24 hours.</em>
          </p>
        `,
            icon: "success",
            confirmButtonText: "Great!",
            background: '#0C290F',
            textColor: 'white',
            denyButtonColor: 'green',
            confirmButtonColor: 'green',
            customClass: {
              popup: 'swal2Style'
            },
          });
          modal.style.display = "none";
          form.reset();
        }, (err) => {
          alert("❌ Failed to send. Please try again.");
          console.error("EmailJS Error:", err);
        });
    });


    // Keep badge showing the users.notificationCount if it exists; otherwise we'll set it inside notifications listener
    if (typeof dataBase.notificationCount !== 'undefined' && dataBase.notificationCount !== null) {
      // ensure numeric (string -> number)
      const parsed = (typeof dataBase.notificationCount === 'string')
        ? parseInt(dataBase.notificationCount, 10)
        : Number(dataBase.notificationCount);
      updateBadge(isNaN(parsed) ? 0 : parsed);
    }



    // start (or restart) notifications listener
    if (unsubscribeNotifications) {
      unsubscribeNotifications();
      unsubscribeNotifications = null;
    }
    unsubscribeNotifications = listenForNotifications(dataBase.id);

    hideSpinnerModal();

    // Re-subscribe to notifications
    if (unsubscribeNotifications) unsubscribeNotifications();
    unsubscribeNotifications = listenForNotifications(dataBase.id);

    hideSpinnerModal();

    // If account is inactive, force sign-out
    if (dataBase.activeuser === "inactive") {
      Swal.fire({
        background: '#0C290F',
        confirmButtonColor: 'green',
        title: 'YOUR ACCOUNT IS CURRENTLY INACTIVE',
        text: "Please contact our customer-service for your account re-activation",
        icon: 'warning',
        confirmButtonText: 'OK!'
      }).then(() => signOutUser());
    }
  }, err => {
    console.error("User doc onSnapshot error:", err);
  });
});


// ===== Dropdown open/close + close handlers (button / outside click / Esc) =====
function openDropdown() {
  if (!dropdownMenu) return;
  dropdownMenu.classList.remove('fade-out');
  dropdownMenu.classList.add('active', 'fade-in');
}

function closeDropdownWithReset() {
  if (!dropdownMenu) return;
  if (!dropdownMenu.classList.contains('active')) return;
  dropdownMenu.classList.remove('fade-in');
  dropdownMenu.classList.add('fade-out');
  // remove active after animation completes
  setTimeout(() => {
    dropdownMenu.classList.remove('active', 'fade-out');
  }, 200);
  // reset the notificationCount (firestore update)
  return resetNotificationCountToZero();
}

notifyBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (dropdownMenu.classList.contains('active')) {
    closeDropdownWithReset();
  } else {
    openDropdown();
  }
});

// click outside -> close & reset
document.addEventListener('click', (e) => {
  if (!notifyBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
    if (dropdownMenu.classList.contains('active')) {
      closeDropdownWithReset();
    }
  }
});

// Esc key -> close & reset
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dropdownMenu.classList.contains('active')) {
    closeDropdownWithReset();
  }
});

// ===== Notifications listener (real-time) =====
function listenForNotifications(userId) {
  // unsubscribe previous if any
  if (unsubscribeNotifications) {
    unsubscribeNotifications();
    unsubscribeNotifications = null;
  }

  const ref = db.collection('notifications')
    .doc(userId)
    .collection('items')
    .orderBy('createdAt', 'desc');

  const unsub = ref.onSnapshot(snapshot => {
    // clear UI
    notificationList.innerHTML = "";

    // Determine how many newest items should be highlighted:
    // 1) Prefer dataBase.notificationCount (even if 0) if it's defined
    // 2) Otherwise fallback to counting unread items in the snapshot
    let notifCount = 0;
    if (dataBase && typeof dataBase.notificationCount !== 'undefined' && dataBase.notificationCount !== null) {
      const parsed = (typeof dataBase.notificationCount === 'string')
        ? parseInt(dataBase.notificationCount, 10)
        : Number(dataBase.notificationCount);
      notifCount = isNaN(parsed) ? 0 : parsed;
    } else {
      // fallback: count docs with read === false
      notifCount = snapshot.docs.filter(d => d.data().read === false).length;
    }

    // Ensure badge shows current value (use dataBase value when present, otherwise fallback)
    if (dataBase && typeof dataBase.notificationCount !== 'undefined' && dataBase.notificationCount !== null) {
      updateBadge(dataBase.notificationCount);
    } else {
      updateBadge(notifCount);
    }

    // Render notifications; snapshot.docs is an array so index is reliable
    snapshot.docs.forEach((docSnap, index) => {
      const notif = docSnap.data();
      const li = document.createElement('li');
      li.setAttribute('data-id', docSnap.id);

      // highlight only the newest 'notifCount' items (index 0 is newest due to desc order)
      if (index < notifCount) {
        li.classList.add('new-notif');
      } else {
        li.classList.remove('new-notif');
      }

      li.innerHTML = `
        <div class="notif-title">${notif.title || ''}</div>
        <div class="notif-message">${notif.message || ''}</div>
      `;
      notificationList.appendChild(li);
    });

    // console.log(`🔔 Notifications updated: ${snapshot.size} · highlighting newest: ${notifCount}`);
  }, err => {
    console.error("Notifications onSnapshot error:", err);
  });

  unsubscribeNotifications = unsub;
  return unsub;
}

// ===== Logout hooking (keeps your previous button) =====
const logoutBtn = document.getElementById('logout');
if (logoutBtn) logoutBtn.addEventListener('click', () => signOutUser());


/////////////////////////
document.getElementById('openDeposit').addEventListener('click', async () => {

  Swal.fire({
    background: '#0C290F',
    showConfirmButton: false,
    width: 600,
    html: `
            <div class="popup-container">
              <h2>Bank Deposit Details</h2>
              <p>Please deposit to the account below. Tap the copy icon to copy details.</p>

              <div class="info-block">
                <div class="info-content">
                  <span class="info-label">Bank Name</span>
                  <span class="info-value" id="bankName">Swift Choice</span>
                </div>
                <button class="copy-btn" onclick="copyText('bankName')">📋</button>
              </div>

              <div class="info-block">
                <div class="info-content">
                  <span class="info-label">Account Holder</span>
                  <span class="info-value" id="accountHolder">${dataBase.firstname} ${dataBase.middlename} ${dataBase.lastname}</span>
                </div>
                <button class="copy-btn" onclick="copyText('accountHolder')">📋</button>
              </div>

              <div class="info-block">
                <div class="info-content">
                  <span class="info-label">Account Number</span>
                  <span class="info-value" id="accountNumber">${dataBase.accountNumber}</span>
                </div>
                <button class="copy-btn" onclick="copyText('accountNumber')">📋</button>
              </div>
            </div>
          `,
    didOpen: () => {
      // Reattach copy functions inside the popup
      window.copyText = function (id) {
        const text = document.getElementById(id).textContent;
        navigator.clipboard.writeText(text).then(() => {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: `Copied: ${text}`,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
          });
        });
      };
    }
  });

});


document.getElementById('Trans2').addEventListener('click', () => {
  // Show confirmation dialog

  Swal.fire({
    title: "Transfer Type",
    background: '#0C290F',
    textColor: 'white',
    showDenyButton: true,
    denyButtonColor: 'green',
    confirmButtonColor: 'green',
    html: `
  <div style="
    text-align:left;
    line-height:1.6;
    max-width:100%;
    font-size:clamp(14px, 2.5vw, 16px);
  ">
    <ul style="margin:0 0 1em 1.2em; padding:0;">
      <li><b>Local Transfers</b> – Fast, secure, and seamless within our customers.</li>
      <li><b>International Transfers</b> – Send money abroad with ease and competitive rates.</li>
    </ul>
  </div>
   `,
    confirmButtonText: "Local Transfer",
    denyButtonText: `International Transfer`,
    customClass: {
      popup: 'swal2Style'
    },
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      window.location.href = "./local.html";
    } else if (result.isDenied) {
      window.location.href = "./international.html";
    }
  });
});

document.getElementById('Trans3').addEventListener('click', () => {
  // Show confirmation dialog

  Swal.fire({
    title: "Transfer Type",
    background: '#0C290F',
    textColor: 'white',
    showDenyButton: true,
    html: `
  <div style="
    text-align:left;
    line-height:1.6;
    max-width:100%;
    font-size:clamp(14px, 2.5vw, 16px);
  ">
    <ul style="margin:0 0 1em 1.2em; padding:0;">
      <li><b>Local Transfers</b> – Fast, secure, and seamless within our customers.</li>
      <li><b>International Transfers</b> – Send money abroad with ease and competitive rates.</li>
    </ul>
   
  </div>
`,
    denyButtonColor: 'green',
    confirmButtonColor: 'green',
    confirmButtonText: "Local Transfer",
    denyButtonText: `International Transfer`,
    customClass: {
      popup: 'swal2Style'
    },
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      window.location.href = "./local.html";
    } else if (result.isDenied) {
      window.location.href = "./international.html";
    }
  });
});

document.getElementById('goLoan').addEventListener('click', () => {
  window.location.href = "loan.html";
});
document.getElementById('cards').addEventListener('click', () => {
  window.location.href = "cards.html";
});