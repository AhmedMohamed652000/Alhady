import './style.css';
import { createCrudPage, createSettingsPage, createProjectGalleryManager } from './crud';
import { login, logout, getToken } from './api';
import { t, getLang, setLang } from './i18n';

// ── Page factories ──────────────────────────────────────────────────────────

const projectPage = () => {
  const wrapper = document.createElement('div');
  wrapper.className = 'space-y-6';
  const crudTable = createCrudPage('Projects', '/projects',
    [{ label: 'Title', key: 'title' }, { label: 'Service', key: 'serviceCategory' }, { label: 'Image', key: 'homeCardImage', type: 'image' }],
    [{ label: 'Title', key: 'title' }, { label: 'Service Category', key: 'serviceCategory' }, { label: 'Home Card Image', key: 'homeCardImage', type: 'image' }, { label: 'Project Image', key: 'projectImage', type: 'image' }, { label: 'Header', key: 'header' }, { label: 'Description', key: 'description', type: 'textarea' }, { label: 'Project Type', key: 'projectDetails.projectType' }, { label: 'Client', key: 'projectDetails.client' }, { label: 'Year', key: 'projectDetails.year' }, { label: 'Location', key: 'projectDetails.location' }, { label: 'Size', key: 'projectDetails.projectSize' }, { label: 'Time', key: 'projectDetails.projectTime' }, { label: 'People', key: 'projectDetails.peopleWorked' }, { label: 'Cost', key: 'projectDetails.projectCost' }, { label: 'Stats Icon', key: 'projectDetails.statisticsIcon' }, { label: 'Order', key: 'order' }, { label: 'Active', key: 'active', type: 'boolean' }]
  );
  const galleryManager = createProjectGalleryManager();
  wrapper.appendChild(crudTable);
  wrapper.appendChild(galleryManager);
  return wrapper;
};

const clientPage = () => createCrudPage('Clients', '/clients',
  [{ label: 'Title', key: 'title' }, { label: 'Icon', key: 'icon', type: 'image' }],
  [{ label: 'Title', key: 'title' }, { label: 'Icon', key: 'icon', type: 'image' }, { label: 'Order', key: 'order' }, { label: 'Active', key: 'active', type: 'boolean' }]
);

const partnerPage = () => createCrudPage('Partners', '/partners',
  [{ label: 'Title', key: 'title' }, { label: 'Icon', key: 'icon', type: 'image' }],
  [{ label: 'Title', key: 'title' }, { label: 'Icon', key: 'icon', type: 'image' }, { label: 'Order', key: 'order' }, { label: 'Active', key: 'active', type: 'boolean' }]
);

const teamPage = () => createCrudPage('Team', '/team',
  [{ label: 'Name', key: 'name' }, { label: 'Position', key: 'position' }, { label: 'Profile Image', key: 'profileImage', type: 'image' }],
  [{ label: 'Name', key: 'name' }, { label: 'Position', key: 'position' }, { label: 'Profile Image', key: 'profileImage', type: 'image' }, { label: 'Order', key: 'order' }, { label: 'Active', key: 'active', type: 'boolean' }]
);

const toolPage = () => createCrudPage('Tools', '/tools',
  [{ label: 'Title', key: 'title' }, { label: 'Icon', key: 'icon', type: 'image' }],
  [{ label: 'Title', key: 'title' }, { label: 'Icon', key: 'icon', type: 'image' }, { label: 'Order', key: 'order' }, { label: 'Active', key: 'active', type: 'boolean' }]
);

const portfolioPage = () => createCrudPage('Portfolio', '/portfolio',
  [{ label: 'Title', key: 'title' }, { label: 'Service', key: 'serviceCategory' }, { label: 'Image', key: 'cardImage', type: 'image' }],
  [{ label: 'Title', key: 'title' }, { label: 'Service Category', key: 'serviceCategory' }, { label: 'Card Image', key: 'cardImage', type: 'image' }, { label: 'Order', key: 'order' }, { label: 'Active', key: 'active', type: 'boolean' }]
);

const reviewPage = () => createCrudPage('Reviews', '/reviews',
  [{ label: 'Name', key: 'name' }, { label: 'Job Title', key: 'jobTitle' }, { label: 'Image', key: 'image', type: 'image' }],
  [{ label: 'Name', key: 'name' }, { label: 'Job Title', key: 'jobTitle' }, { label: 'Description', key: 'description', type: 'textarea' }, { label: 'Image', key: 'image', type: 'image' }, { label: 'Order', key: 'order' }, { label: 'Active', key: 'active', type: 'boolean' }]
);

const settingsPage = () => createSettingsPage([
  { label: 'Company Name', key: 'companyName' },
  { label: 'Phone', key: 'phone' },
  { label: 'Email', key: 'email' },
  { label: 'Address', key: 'address' },
  { label: 'Facebook URL', key: 'facebook' },
  { label: 'Twitter URL', key: 'twitter' },
  { label: 'Instagram URL', key: 'instagram' },
  { label: 'LinkedIn URL', key: 'linkedin' },
  { label: 'Pinterest URL', key: 'pinterest' },
  { label: 'Years Experience', key: 'yearsExperience', type: 'number' },
  { label: 'Projects Completed', key: 'projectsCompleted', type: 'number' },
  { label: 'Team Size', key: 'teamSize', type: 'number' },
  { label: 'About Description', key: 'aboutDescription', type: 'textarea' },
  { label: 'Hero Title', key: 'heroTitle' },
  { label: 'Hero Subtitle', key: 'heroSubtitle' },
]);

const jobPage = () => createCrudPage('Jobs', '/jobs',
  [{ label: 'Title', key: 'title' }, { label: 'Location', key: 'location' }, { label: 'Type', key: 'type' }],
  [{ label: 'Title', key: 'title' }, { label: 'Location', key: 'location' }, { label: 'Type', key: 'type' }, { label: 'Salary', key: 'salary' }, { label: 'Description', key: 'description', type: 'textarea' }, { label: 'Requirements', key: 'requirements', type: 'textarea' }, { label: 'Order', key: 'order' }, { label: 'Active', key: 'active', type: 'boolean' }]
);

const pagesMap = {
  projects: projectPage,
  clients: clientPage,
  partners: partnerPage,
  team: teamPage,
  tools: toolPage,
  portfolio: portfolioPage,
  reviews: reviewPage,
  jobs: jobPage,
  settings: settingsPage,
};

// ── Theme ───────────────────────────────────────────────────────────────────

function getTheme() {
  return localStorage.getItem('alhady_theme') || 'dark';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('alhady_theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = `ph ${theme === 'dark' ? 'ph-sun' : 'ph-moon'} text-xl`;
}

// ── Static text updater ─────────────────────────────────────────────────────

function updateStaticText() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  const langIndicator = document.getElementById('lang-indicator');
  if (langIndicator) langIndicator.textContent = getLang() === 'ar' ? 'EN' : 'ع';
}

// ── DOM ready ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const navItems    = document.querySelectorAll('.nav-item');
  const sidebar     = document.getElementById('sidebar');
  const mobileMenuBtn   = document.getElementById('mobile-menu-btn');
  const closeSidebarBtn = document.getElementById('close-sidebar');
  const sidebarOverlay  = document.getElementById('sidebar-overlay');

  // Apply persisted theme
  applyTheme(getTheme());
  // Apply initial translations
  updateStaticText();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const loginScreen = document.getElementById('login-screen');
  const loginForm   = document.getElementById('login-form');
  const loginError  = document.getElementById('login-error');
  const logoutBtn   = document.getElementById('logout-btn');

  const checkAuth = () => {
    getToken() ? loginScreen.classList.add('hidden') : loginScreen.classList.remove('hidden');
  };
  checkAuth();

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="ph ph-spinner animate-spin text-xl"></i>';
    btn.disabled = true;
    try {
      const res = await login(email, password);
      if (res.success) {
        loginScreen.classList.add('hidden');
        loginError.classList.add('hidden');
      } else {
        loginError.textContent = res.message || t('Login failed');
        loginError.classList.remove('hidden');
      }
    } catch {
      loginError.textContent = t('Server error. Please try again.');
      loginError.classList.remove('hidden');
    } finally {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }
  });

  logoutBtn.addEventListener('click', logout);

  // ── Page routing ──────────────────────────────────────────────────────────
  let currentPage = 'tools';

  function renderPage(pageKey) {
    if (!pagesMap[pageKey]) pageKey = 'tools';
    currentPage = pageKey;
    mainContent.innerHTML = '';
    mainContent.appendChild(pagesMap[pageKey]());
    
    // Update active class on nav items
    navItems.forEach(n => {
      if (n.getAttribute('data-page') === pageKey) {
        n.classList.add('active');
      } else {
        n.classList.remove('active');
      }
    });
  }

  function handleRouting() {
    const hash = window.location.hash.replace('#', '');
    renderPage(hash || 'tools');
  }

  window.addEventListener('hashchange', handleRouting);
  handleRouting();

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 768) toggleSidebar();
    });
  });

  window.addEventListener('hashchange', handleRouting);

  // ── Language toggle ───────────────────────────────────────────────────────
  document.getElementById('lang-toggle-btn').addEventListener('click', () => {
    setLang(getLang() === 'ar' ? 'en' : 'ar');
    updateStaticText();
    renderPage(currentPage);
  });

  // ── Theme toggle ──────────────────────────────────────────────────────────
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });

  // ── Mobile sidebar ────────────────────────────────────────────────────────
  function toggleSidebar() {
    const isHidden = sidebar.classList.contains('hidden');
    if (isHidden) {
      sidebar.classList.remove('hidden');
      sidebar.classList.add('flex');
      sidebarOverlay.classList.remove('hidden');
      setTimeout(() => sidebarOverlay.classList.remove('opacity-0'), 10);
    } else {
      sidebarOverlay.classList.add('opacity-0');
      setTimeout(() => {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('flex');
        sidebarOverlay.classList.add('hidden');
      }, 300);
    }
  }

  mobileMenuBtn.addEventListener('click', toggleSidebar);
  closeSidebarBtn.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', toggleSidebar);
});
