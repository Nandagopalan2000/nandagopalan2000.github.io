/**
 * Nandagopalan V - Portfolio JavaScript
 * Interactive Cyber-SOC features, terminal simulation, project inspection & filters
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initNavbar();
  initTerminalTabs();
  initSkillsFilter();
  initProjectModals();
  initContactForm();
  initCopyButtons();
});

/* -------------------------------------------------------------------------
   1. Cyber Grid & Floating Particle Network Canvas
   ------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 32), 45);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.6 + 0.8,
      color: Math.random() > 0.4 ? 'rgba(16, 185, 129, ' : 'rgba(6, 182, 212, ',
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // Draw and update particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.75)';
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* -------------------------------------------------------------------------
   2. Navbar Scroll & Mobile Navigation
   ------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for active section link
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }
}

/* -------------------------------------------------------------------------
   3. Hero Terminal Tabs Switcher
   ------------------------------------------------------------------------- */
function initTerminalTabs() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const contents = document.querySelectorAll('.terminal-content');
  const badge = document.querySelector('.terminal-badge');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      if (badge) {
        if (targetId === 'tab-sentinel') badge.textContent = 'KQL Analytics';
        if (targetId === 'tab-wazuh') badge.textContent = 'Wazuh Decoder XML';
        if (targetId === 'tab-triage') badge.textContent = 'SOC Incident Response';
      }
    });
  });
}

/* -------------------------------------------------------------------------
   4. Skills Filter
   ------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------
   5. Project Modals & Technical Deep Dives
   ------------------------------------------------------------------------- */
const projectDetails = {
  sentinel: {
    title: 'Microsoft Sentinel – Cloud SOC Monitoring Lab',
    date: 'October 2026',
    repoUrl: 'https://github.com/Nandagopalan2000/azure-sentinel-cloud-soc-lab',
    description:
      'Configured Microsoft Sentinel SIEM over an Azure Log Analytics workspace to monitor Azure infrastructure activity and establish real-time alert triage rules for brute-force and credential abuse.',
    mitre: 'T1078 (Valid Accounts), T1110 (Brute Force)',
    kqlHeader: 'KQL Analytics Rule (3+ Failed Operations in 15 Minutes):',
    code: `AzureActivity
| where TimeGenerated >= ago(15m)
| where ActivityStatusValue in~ ("Failed", "Failure")
| summarize 
    FailedCount = count(),
    TargetResources = make_set(Resource),
    TargetOperations = make_set(OperationNameValue),
    TargetResourceGroups = make_set(ResourceGroup)
  by Caller, bin(TimeGenerated, 15m)
| where FailedCount >= 3
| extend Severity = iff(FailedCount > 10, "High", "Medium")
| project TimeGenerated, Caller, FailedCount, TargetOperations, TargetResourceGroups, Severity`,
    takeaways: [
      'Connected native Azure Activity logs via Sentinel Content Hub solution.',
      'Constructed precise KQL queries investigating failed administrative and resource modification attempts.',
      'Configured automated incident creation with entity mapping (Caller -> Account, ResourceGroup -> Cloud Resource).',
      'Documented detection edge cases, alert suppression mechanisms, and remediation runbooks.',
    ],
  },
  wazuh: {
    title: 'Wazuh – SIEM and Endpoint Monitoring Lab',
    date: 'September 2026',
    repoUrl: 'https://github.com/Nandagopalan2000/wazuh-siem-detection-lab',
    description:
      'Engineered a multi-node threat detection architecture utilizing Wazuh all-in-one SIEM on Ubuntu Server, Windows and Debian agents, and an isolated Kali Linux attacker node over Tailscale mesh network.',
    mitre: 'T1046 (Network Service Discovery), T1059 (Command & Scripting)',
    kqlHeader: 'Custom Wazuh XML Decoder & Correlation Rule:',
    code: `<!-- Custom Decoder for iptables Port Scan Logs -->
<decoder name="iptables-portscan">
  <prematch>^iptables-drop: </prematch>
</decoder>

<decoder name="iptables-fields">
  <parent>iptables-portscan</parent>
  <regex offset="after_parent">SRC=(\\S+) DST=(\\S+) .* PROTO=(\\S+) SPT=(\\d+) DPT=(\\d+)</regex>
  <order>srcip, dstip, proto, srcport, dstport</order>
</decoder>

<!-- Wazuh Rule: Alert on 10+ dropped packets from single IP within 10s -->
<rule id="100020" level="10" frequency="10" timeframe="10">
  <if_matched_sid>100010</if_matched_sid>
  <same_source_ip />
  <description>Possible Network Port Scan detected from $(srcip) (MITRE T1046)</description>
  <mitre>
    <id>T1046</id>
  </mitre>
</rule>`,
    takeaways: [
      'Deployed resilient Tailscale overlay to securely connect cross-cloud and local agent endpoints.',
      'Wrote custom regex decoders to parse raw firewall/iptables connection drops.',
      'Mapped custom rules directly to MITRE ATT&CK T1046 for standardized SOC categorization.',
      'Diagnosed and resolved complex Wazuh indexer startup issues by tuning JVM heap allocations and systemd timeouts.',
    ],
  },
  cowrie: {
    title: 'Cowrie – SSH Honeypot and Log Monitoring',
    date: 'September 2026',
    repoUrl: 'https://github.com/Nandagopalan2000/cowrie-honeypot-log-monitoring',
    description:
      'Deployed an internet-facing Cowrie SSH deception honeypot on a hardened Debian VM to trap automated brute-force attacks, malware delivery scripts, and reconnaissance behavior in real time.',
    mitre: 'T1110.001 (Password Guessing), T1059.004 (Unix Shell)',
    kqlHeader: 'Promtail Log Pipeline Config & Loki Ingestion:',
    code: `scrape_configs:
  - job_name: cowrie-honeypot
    static_configs:
      - targets: ['localhost']
        labels:
          job: cowrie
          host: debian-honeypot-01
          __path__: /var/log/cowrie/cowrie.json
    pipeline_stages:
      - json:
          expressions:
            eventid: eventid
            src_ip: src_ip
            username: username
            password: password
            session: session
      - labels:
          eventid:
          src_ip:`,
    takeaways: [
      'Captured live credential stuffing attempts, dictionary attacks, and unauthorized shell executions.',
      'Streamed structured JSON events into Grafana Loki via Promtail pipeline.',
      'Engineered interactive Grafana dashboards tracking top attacker geo-origins, attempted credentials, and malicious file downloads.',
      'Compiled comprehensive threat intelligence report documenting real-world attack patterns.',
    ],
  },
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const viewBtns = document.querySelectorAll('.view-project-details');

  if (!modal) return;

  viewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectDetails[projKey];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-date').textContent = `${data.date} • MITRE ATT&CK: ${data.mitre}`;
      document.getElementById('modal-desc').textContent = data.description;
      document.getElementById('modal-code-header').textContent = data.kqlHeader;
      document.getElementById('modal-code').textContent = data.code;
      document.getElementById('modal-repo-link').setAttribute('href', data.repoUrl);

      const takeawaysList = document.getElementById('modal-takeaways');
      takeawaysList.innerHTML = '';
      data.takeaways.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        takeawaysList.appendChild(li);
      });

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* -------------------------------------------------------------------------
   6. Contact Form Handling
   ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const copyBtn = document.getElementById('copy-msg-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const type = document.getElementById('c-type').value;
    const message = document.getElementById('c-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    const subject = encodeURIComponent(`[SOC Inquiry - ${type}] From ${name}`);
    const body = encodeURIComponent(
      `Hello Nandagopalan,\n\nName: ${name}\nEmail: ${email}\nInquiry Type: ${type}\n\nMessage:\n${message}\n\nBest regards,\n${name}`
    );

    // Open user's email client
    window.location.href = `mailto:nandagopalan26@gmail.com?subject=${subject}&body=${body}`;

    if (feedback) {
      feedback.textContent = '✓ Ready to send! Your email client has been opened. Thank you for reaching out!';
      feedback.className = 'form-feedback success';
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const name = document.getElementById('c-name').value.trim() || 'Recruiter/Manager';
      const email = document.getElementById('c-email').value.trim() || 'N/A';
      const message = document.getElementById('c-message').value.trim() || 'Inquiry regarding SOC Analyst role';

      const fullText = `Contact Name: ${name}\nEmail: ${email}\nMessage: ${message}\nTarget: nandagopalan26@gmail.com`;

      navigator.clipboard.writeText(fullText).then(() => {
        copyBtn.textContent = '✓ Details Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy Inquiry Text';
        }, 2500);
      });
    });
  }
}

/* -------------------------------------------------------------------------
   7. Copy to Clipboard Utility for Phone & Email
   ------------------------------------------------------------------------- */
function initCopyButtons() {
  document.querySelectorAll('.copy-clip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      if (!targetText) return;

      navigator.clipboard.writeText(targetText).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span style="color:#10b981; font-weight:600;">✓ Copied</span>`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      });
    });
  });
}
