import { api, getImageUrl } from './api';
import { t } from './i18n';

// ── Image optimizer ─────────────────────────────────────────────────────────
const optimizeImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') return resolve(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const name = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            resolve(new File([blob], name, { type: 'image/webp', lastModified: Date.now() }));
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        }, 'image/webp', quality);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// ── CRUD Page ───────────────────────────────────────────────────────────────
export function createCrudPage(title, endpoint, columns, fields, options = {}) {
  const { onUpdate = null, idKey = '_id' } = options;
  let dataList = [];

  const container = document.createElement('div');
  container.className = 'space-y-6';

  container.innerHTML = `
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-3xl font-bold">${t(title)}</h2>
        <p class="text-textMuted mt-1">${t('Manage your {title} here.', { title: t(title) })}</p>
      </div>
      <button id="add-new-btn"
        class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
        <i class="ph ph-plus text-lg"></i> ${t('Add New')}
      </button>
    </div>
  `;

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'glass-panel p-6 overflow-x-auto';

  const modalWrapper = document.createElement('div');
  modalWrapper.className = 'fixed inset-0 z-50 bg-black/50 hidden flex items-center justify-center p-4 backdrop-blur-sm';
  modalWrapper.innerHTML = `
    <div class="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold" id="modal-title">${t('Add {title}', { title: t(title) })}</h3>
        <button id="close-modal-btn" class="text-textMuted hover:text-textMain">
          <i class="ph ph-x text-xl"></i>
        </button>
      </div>
      <form id="crud-form" class="space-y-4">
        <div id="form-fields" class="space-y-4"></div>
        <div class="flex justify-end gap-3 pt-4 border-t border-border">
          <button type="button" id="cancel-btn" class="px-4 py-2 text-textMuted hover:text-textMain transition-colors">
            ${t('Cancel')}
          </button>
          <button type="submit" class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            ${t('Save')}
          </button>
        </div>
      </form>
    </div>
  `;

  container.appendChild(tableWrapper);
  container.appendChild(modalWrapper);

  const loadData = async () => {
    const res = await api.get(endpoint);
    if (res.success) {
      dataList = res.data;
      renderTable();
    }
  };

  const reorderItems = async (items) => {
    try {
      await api.patch(`${endpoint}/reorder`, { items });
      loadData();
    } catch (err) {
      alert(t('Reordering failed: {message}', { message: err.message }));
    }
  };

  // ── Render table ──────────────────────────────────────────────────────────
  const renderTable = () => {
    // Improved detection: check fields or dataList
  const hasOrder = fields.some(f => f.key === 'order') ||
    (dataList.length > 0 && typeof dataList[0].order !== 'undefined') ||
    ['banners', 'services', 'tools', 'clients', 'partners', 'team', 'projects', 'portfolio', 'reviews'].some(e => endpoint.includes(e));

  const hasActive = fields.some(f => f.key === 'active') ||
    (dataList.length > 0 && typeof dataList[0].active !== 'undefined') ||
    ['banners', 'services', 'tools', 'clients', 'partners', 'team', 'projects', 'portfolio', 'reviews'].some(e => endpoint.includes(e));

  tableWrapper.innerHTML = `
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border text-textMuted text-sm">
            ${hasActive ? `<th class="pb-3 font-medium px-4 text-start w-16">${t('Active')}</th>` : ''}
            ${hasOrder ? `<th class="pb-3 font-medium px-4 text-start w-16">${t('Order')}</th>` : ''}
            ${columns.map(col => `<th class="pb-3 font-medium px-4 text-start">${t(col.label)}</th>`).join('')}
            <th class="pb-3 font-medium px-4 text-end">${t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${dataList.map((item, index) => `
            <tr class="border-b border-border/50 transition-colors table-row ${hasActive && !item.active ? 'opacity-60 bg-black/5' : ''}">
              ${hasActive ? `
                <td class="py-4 px-4">
                  <button class="toggle-active-btn" data-id="${item[idKey]}" data-active="${item.active}" title="${item.active ? t('Deactivate') : t('Activate')}">
                    <i class="ph ${item.active ? 'ph-toggle-right text-primary text-2xl' : 'ph-toggle-left text-textMuted text-2xl'}"></i>
                  </button>
                </td>
              ` : ''}
              ${hasOrder ? `
                <td class="py-4 px-4">
                  <div class="flex flex-col items-center gap-1">
                    <button class="move-up-btn text-textMuted hover:text-primary transition-colors disabled:opacity-30" 
                            data-index="${index}" ${index === 0 ? 'disabled' : ''}>
                      <i class="ph ph-caret-up-bold"></i>
                    </button>
                    <span class="text-xs font-bold text-textMuted">${item.order}</span>
                    <button class="move-down-btn text-textMuted hover:text-primary transition-colors disabled:opacity-30" 
                            data-index="${index}" ${index === dataList.length - 1 ? 'disabled' : ''}>
                      <i class="ph ph-caret-down-bold"></i>
                    </button>
                  </div>
                </td>
              ` : ''}
              ${columns.map(col => {
    const val = col.key.split('.').reduce((a, b) => a && a[b], item);
    return `
                  <td class="py-4 px-4 text-sm text-textMain">
                    ${col.type === 'image' && val
        ? `<img src="${getImageUrl(val)}" class="w-12 h-12 rounded object-cover shadow-sm">`
        : col.type === 'boolean'
          ? (val ? t('Yes') : t('No'))
          : (val || '—')}
                  </td>
                `;
  }).join('')}
              <td class="py-4 px-4">
                <div class="flex justify-end items-center gap-2">
                  <button class="text-secondary hover:text-textMain transition-colors edit-btn" data-index="${index}">
                    <i class="ph ph-pencil-simple text-lg"></i>
                  </button>
                  <button class="text-red-400 hover:text-red-300 transition-colors delete-btn" data-id="${item[idKey]}">
                    <i class="ph ph-trash text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
          ${dataList.length === 0
      ? `<tr><td colspan="${columns.length + (hasActive ? 1 : 0) + (hasOrder ? 1 : 0) + 1}" class="text-center py-8 text-textMuted">${t('No data found')}</td></tr>`
      : ''}
        </tbody>
      </table>
    `;

  tableWrapper.querySelectorAll('.toggle-active-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      const currentActive = e.currentTarget.dataset.active === 'true';
      // Use PATCH for partial update
      await api.patch(`${endpoint}/${id}`, { active: !currentActive });
      loadData();
    });
  });

  tableWrapper.querySelectorAll('.move-up-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const idx = parseInt(e.currentTarget.dataset.index);
      if (idx === 0) return;
      const items = [
        { id: dataList[idx][idKey], order: dataList[idx - 1].order },
        { id: dataList[idx - 1][idKey], order: dataList[idx].order }
      ];
      await reorderItems(items);
    });
  });

  tableWrapper.querySelectorAll('.move-down-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const idx = parseInt(e.currentTarget.dataset.index);
      if (idx === dataList.length - 1) return;
      const items = [
        { id: dataList[idx][idKey], order: dataList[idx + 1].order },
        { id: dataList[idx + 1][idKey], order: dataList[idx].order }
      ];
      await reorderItems(items);
    });
  });

  tableWrapper.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openModal(dataList[e.currentTarget.dataset.index]);
    });
  });

  tableWrapper.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if (!confirm(t('Are you sure you want to delete this item?'))) return;
      await api.delete(`${endpoint}/${e.currentTarget.dataset.id}`);
      loadData();
    });
  });
  };

  // ── Modal ─────────────────────────────────────────────────────────────────
  let currentEditingId = null;

  const openModal = (item = null) => {
  currentEditingId = item ? item[idKey] : null;
  modalWrapper.querySelector('#modal-title').textContent = item
    ? t('Edit {title}', { title: t(title) })
    : t('Add {title}', { title: t(title) });

  const formFields = modalWrapper.querySelector('#form-fields');
  formFields.innerHTML = fields.map(field => {
    const getVal = (obj, path) => path.split('.').reduce((acc, p) => acc && acc[p], obj);
    const val = item ? (getVal(item, field.key) ?? '') : '';
    const safeKey = field.key.replace(/\./g, '_');

    if (field.type === 'image') return `
        <div>
          <label class="block text-sm font-medium text-textMuted mb-1">${t(field.label)}</label>
          ${val
        ? `<img src="${getImageUrl(val)}" class="w-24 h-24 object-cover rounded mb-2" id="preview-${safeKey}">`
        : `<img id="preview-${safeKey}" class="w-24 h-24 object-cover rounded mb-2 hidden">`}
          <input type="file" id="input-${safeKey}" accept="image/*"
            class="w-full text-sm text-textMuted file:me-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/20 file:text-primary hover:file:bg-primary/30 transition-colors">
          <input type="hidden" id="val-${safeKey}" value="${val}">
        </div>`;

    if (field.type === 'textarea') return `
        <div>
          <label class="block text-sm font-medium text-textMuted mb-1">${t(field.label)}</label>
          <textarea id="input-${safeKey}" rows="3"
            class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-textMain">${val}</textarea>
        </div>`;

    if (field.type === 'boolean') return `
        <div class="flex items-center gap-2">
          <input type="checkbox" id="input-${safeKey}" ${val ? 'checked' : ''}
            class="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-1">
          <label class="text-sm font-medium text-textMuted">${t(field.label)}</label>
        </div>`;

    return `
        <div>
          <label class="block text-sm font-medium text-textMuted mb-1">${t(field.label)}</label>
          <input type="${field.type === 'number' ? 'number' : 'text'}" id="input-${safeKey}" value="${val}"
            class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-textMain">
        </div>`;
  }).join('');

  // Image upload handlers
  fields.forEach(field => {
    if (field.type !== 'image') return;
    const safeKey = field.key.replace(/\./g, '_');
    const fileInput = formFields.querySelector(`#input-${safeKey}`);
    fileInput.addEventListener('change', async (e) => {
      if (!e.target.files[0]) return;
      fileInput.disabled = true;
      try {
        const optimized = await optimizeImage(e.target.files[0]);
        const res = await api.uploadImage(optimized);
        if (res.success) {
          formFields.querySelector(`#val-${safeKey}`).value = res.data.url;
          const preview = formFields.querySelector(`#preview-${safeKey}`);
          preview.src = getImageUrl(res.data.url);
          preview.classList.remove('hidden');
        }
      } catch {
        alert(t('Image upload failed'));
      } finally {
        fileInput.disabled = false;
      }
    });
  });

  modalWrapper.classList.remove('hidden');
};

const closeModal = () => modalWrapper.classList.add('hidden');

container.querySelector('#add-new-btn').addEventListener('click', () => openModal());
modalWrapper.querySelector('#close-modal-btn').addEventListener('click', closeModal);
modalWrapper.querySelector('#cancel-btn').addEventListener('click', closeModal);

modalWrapper.querySelector('#crud-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {};
  fields.forEach(field => {
    const safeKey = field.key.replace(/\./g, '_');
    let val;
    if (field.type === 'image') val = modalWrapper.querySelector(`#val-${safeKey}`).value;
    else if (field.type === 'boolean') val = modalWrapper.querySelector(`#input-${safeKey}`).checked;
    else if (field.type === 'number') val = Number(modalWrapper.querySelector(`#input-${safeKey}`).value);
    else val = modalWrapper.querySelector(`#input-${safeKey}`).value;
    const parts = field.key.split('.');
    let cur = payload;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  });

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = `<i class="ph ph-spinner animate-spin me-2"></i> ${t('Saving...')}`;
  submitBtn.disabled = true;
  try {
    if (currentEditingId) await api.put(`${endpoint}/${currentEditingId}`, payload);
    else await api.post(endpoint, payload);
    closeModal();
    loadData();
    if (onUpdate) onUpdate();
  } catch (err) {
    alert(t('Operation failed: {message}', { message: err.message }));
  } finally {
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
  }
});

  loadData();
  return container;
}
// ── Project Gallery Manager ─────────────────────────────────────────────────
export function createProjectGalleryManager() {
  let projects = [];
  let selectedProjectId = null;
  let currentSamples = [];
  let isUploading = false;

  const container = document.createElement('div');
  container.className = 'space-y-6 mt-8';

  container.innerHTML = `
    <div class="glass-panel p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 class="text-xl font-bold flex items-center gap-2">
            <i class="ph ph-images text-primary"></i> ${t('Project Gallery Images')}
          </h3>
          <p class="text-textMuted text-sm mt-1">${t('Upload and manage gallery images for each project.')}</p>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-textMuted mb-2">${t('Select Project')}</label>
        <select id="gallery-project-select"
          class="w-full md:w-80 bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-textMain">
          <option value="">${t('— Choose a project —')}</option>
        </select>
      </div>

      <div id="gallery-panel" class="hidden">
        <!-- Upload Zone -->
        <div id="gallery-upload-zone"
          class="border-2 border-dashed border-border rounded-xl p-8 text-center mb-6 hover:border-primary/60 transition-all cursor-pointer">
          <div id="upload-idle-state">
            <i class="ph ph-cloud-arrow-up text-4xl text-textMuted mb-2 block"></i>
            <p class="text-textMuted text-sm font-medium">${t('Click or drag images here to upload')}</p>
            <p class="text-textMuted/60 text-xs mt-1">${t('PNG, JPG, WebP – max 5MB each · Multiple files allowed')}</p>
          </div>
          <div id="upload-busy-state" class="hidden">
            <i class="ph ph-spinner animate-spin text-4xl text-primary mb-2 block"></i>
            <p class="text-textMuted text-sm">${t('Upload in progress — please wait…')}</p>
          </div>
          <input type="file" id="gallery-file-input" accept="image/*" multiple class="hidden">
        </div>

        <!-- Progress Bar -->
        <div id="gallery-progress" class="hidden mb-5 bg-background/60 border border-border rounded-xl p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-textMain flex items-center gap-2">
              <i class="ph ph-spinner animate-spin text-primary"></i>
              <span id="gallery-progress-text"></span>
            </span>
            <span id="gallery-progress-pct" class="text-sm font-bold text-primary">0%</span>
          </div>
          <div class="w-full bg-border/60 rounded-full h-2 overflow-hidden">
            <div id="gallery-progress-bar"
              class="bg-gradient-to-r from-primary to-yellow-400 h-2 rounded-full transition-all duration-500"
              style="width: 0%"></div>
          </div>
          <p id="gallery-progress-file" class="text-xs text-textMuted/60 mt-2 truncate"></p>
        </div>

        <!-- Skeleton -->
        <div id="gallery-skeleton" class="hidden">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            ${Array(8).fill(0).map(() => `
              <div class="rounded-xl overflow-hidden border border-border bg-background animate-pulse">
                <div class="w-full h-36 bg-white/5"></div>
                <div class="p-2 space-y-1.5">
                  <div class="h-2 bg-white/5 rounded w-3/4"></div>
                  <div class="h-2 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Gallery Grid -->
        <div id="gallery-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"></div>
      </div>
    </div>
  `;

  // ── Image Details Modal ───────────────────────────────────────────────────
  const imageModal = document.createElement('div');
  imageModal.className = 'fixed inset-0 z-50 bg-black/60 hidden items-center justify-center p-4 backdrop-blur-sm';
  imageModal.innerHTML = `
    <div class="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-lg font-bold">${t('Image Details')}</h4>
        <button id="img-modal-close" class="text-textMuted hover:text-textMain">
          <i class="ph ph-x text-xl"></i>
        </button>
      </div>
      <img id="img-modal-preview" class="w-full h-48 object-cover rounded-lg mb-4" src="" alt="">
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-textMuted mb-1">${t('Caption / Title')}</label>
          <input type="text" id="img-modal-title" placeholder="${t('e.g. Main Entrance')}"
            class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-textMain">
        </div>
        <div>
          <label class="block text-xs font-medium text-textMuted mb-1">${t('Description')}</label>
          <textarea id="img-modal-desc" rows="2" placeholder="${t('Short description…')}"
            class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-textMain resize-none"></textarea>
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-border">
        <button id="img-modal-cancel" class="px-4 py-2 text-textMuted hover:text-textMain text-sm transition-colors">
          ${t('Cancel')}
        </button>
        <button id="img-modal-save"
          class="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <i class="ph ph-floppy-disk"></i> ${t('Save')}
        </button>
      </div>
    </div>
  `;
  container.appendChild(imageModal);

  let editingIndex = null;
  const openImageModal = () => { imageModal.classList.remove('hidden'); imageModal.classList.add('flex'); };
  const closeImageModal = () => { imageModal.classList.add('hidden'); imageModal.classList.remove('flex'); editingIndex = null; };

  imageModal.querySelector('#img-modal-close').addEventListener('click', closeImageModal);
  imageModal.querySelector('#img-modal-cancel').addEventListener('click', closeImageModal);

  imageModal.querySelector('#img-modal-save').addEventListener('click', async () => {
    if (editingIndex === null) return;
    const saveBtn = imageModal.querySelector('#img-modal-save');
    const orig = saveBtn.innerHTML;
    saveBtn.innerHTML = `<i class="ph ph-spinner animate-spin"></i> ${t('Saving…')}`;
    saveBtn.disabled = true;
    try {
      currentSamples[editingIndex].title = imageModal.querySelector('#img-modal-title').value;
      currentSamples[editingIndex].description = imageModal.querySelector('#img-modal-desc').value;
      await saveSamples();
      renderGallery();
      closeImageModal();
    } catch (err) {
      alert(t('Failed to save: {message}', { message: err.message }));
    } finally {
      saveBtn.innerHTML = orig;
      saveBtn.disabled = false;
    }
  });

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const getSelect = () => container.querySelector('#gallery-project-select');
  const getPanel = () => container.querySelector('#gallery-panel');
  const getGrid = () => container.querySelector('#gallery-grid');
  const getSkeleton = () => container.querySelector('#gallery-skeleton');
  const getProgress = () => container.querySelector('#gallery-progress');
  const getUploadZone = () => container.querySelector('#gallery-upload-zone');
  const getIdleState = () => container.querySelector('#upload-idle-state');
  const getBusyState = () => container.querySelector('#upload-busy-state');

  const setUploadBusy = (busy) => {
    isUploading = busy;
    const zone = getUploadZone();
    if (busy) {
      zone.classList.add('cursor-not-allowed', 'opacity-60', 'pointer-events-none');
      getIdleState().classList.add('hidden');
      getBusyState().classList.remove('hidden');
    } else {
      zone.classList.remove('cursor-not-allowed', 'opacity-60', 'pointer-events-none');
      getIdleState().classList.remove('hidden');
      getBusyState().classList.add('hidden');
    }
  };

  const showProgress = (done, total, filename = '') => {
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const prog = getProgress();
    prog.classList.remove('hidden');
    prog.querySelector('#gallery-progress-text').textContent =
      t('Uploading {done} of {total} images…', { done, total });
    prog.querySelector('#gallery-progress-bar').style.width = `${pct}%`;
    prog.querySelector('#gallery-progress-pct').textContent = `${pct}%`;
    prog.querySelector('#gallery-progress-file').textContent =
      filename ? t('Processing: {filename}', { filename }) : '';
  };

  const hideProgress = () => {
    const prog = getProgress();
    prog.classList.add('hidden');
    prog.querySelector('#gallery-progress-bar').style.width = '0%';
    prog.querySelector('#gallery-progress-pct').textContent = '0%';
  };

  const showGalleryLoading = () => { getSkeleton().classList.remove('hidden'); getGrid().classList.add('hidden'); };
  const hideGalleryLoading = () => { getSkeleton().classList.add('hidden'); getGrid().classList.remove('hidden'); };

  // ── Gallery grid ──────────────────────────────────────────────────────────
  const renderGallery = () => {
    const grid = getGrid();
    if (currentSamples.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-12 text-textMuted">
          <i class="ph ph-images text-5xl mb-3 opacity-20"></i>
          <p class="text-sm">${t('No gallery images yet.')}</p>
          <p class="text-xs mt-1 opacity-60">${t('Upload images using the zone above.')}</p>
        </div>`;
      return;
    }
    grid.innerHTML = currentSamples.map((sample, i) => `
      <div class="relative group rounded-xl overflow-hidden border border-border bg-background">
        <img src="${getImageUrl(sample.image)}" alt="${sample.title || ''}"
          class="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105">
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <p class="text-white text-xs font-medium truncate">${sample.title || t('(no caption)')}</p>
          <div class="flex gap-2 mt-2">
            <button class="edit-sample-btn flex-1 text-xs bg-white/20 hover:bg-primary/80 text-white rounded-lg py-1.5 transition-colors font-medium" data-index="${i}">
              <i class="ph ph-pencil-simple"></i> ${t('Edit')}
            </button>
            <button class="delete-sample-btn flex-1 text-xs bg-red-500/80 hover:bg-red-500 text-white rounded-lg py-1.5 transition-colors font-medium" data-sample-id="${sample._id || ''}">
              <i class="ph ph-trash"></i> ${t('Remove')}
            </button>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.edit-sample-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        editingIndex = index;
        imageModal.querySelector('#img-modal-preview').src = getImageUrl(currentSamples[index].image);
        imageModal.querySelector('#img-modal-title').value = currentSamples[index].title || '';
        imageModal.querySelector('#img-modal-desc').value = currentSamples[index].description || '';
        openImageModal();
      });
    });

    grid.querySelectorAll('.delete-sample-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm(t('Remove this image from the gallery?'))) return;
        const deleteBtn = e.currentTarget;
        const sampleId = deleteBtn.dataset.sampleId;
        const origHTML = deleteBtn.innerHTML;
        deleteBtn.innerHTML = '<i class="ph ph-spinner animate-spin"></i>';
        deleteBtn.disabled = true;
        try {
          if (sampleId) await api.delete(`/projects/${selectedProjectId}/samples/${sampleId}`);
          await loadSamples();
        } catch (err) {
          alert(t('Failed to remove image: {message}', { message: err.message }));
          deleteBtn.innerHTML = origHTML;
          deleteBtn.disabled = false;
        }
      });
    });
  };

  const saveSamples = () => api.put(`/projects/${selectedProjectId}/samples`, { samples: currentSamples });

  const loadSamples = async () => {
    if (!selectedProjectId) return;
    showGalleryLoading();
    try {
      const res = await api.get(`/projects/${selectedProjectId}`);
      if (res.success) { currentSamples = res.data.projectSamples || []; renderGallery(); }
    } catch (err) {
      console.error(err);
    } finally {
      hideGalleryLoading();
    }
  };

  // ── Multi-file upload ─────────────────────────────────────────────────────
  const handleFiles = async (files) => {
    if (!selectedProjectId || isUploading) return;
    const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArr.length === 0) return;

    setUploadBusy(true);
    showProgress(0, fileArr.length);
    let done = 0, failed = 0;

    for (const file of fileArr) {
      showProgress(done, fileArr.length, file.name);
      try {
        const optimized = await optimizeImage(file);
        const uploadRes = await api.uploadImage(optimized);
        if (uploadRes.success) {
          await api.post(`/projects/${selectedProjectId}/samples`, { image: uploadRes.data.url, title: '', description: '' });
          done++;
          showProgress(done, fileArr.length, file.name);
        } else {
          failed++;
        }
      } catch (err) {
        console.error('Upload failed for', file.name, err);
        failed++;
      }
    }

    hideProgress();
    setUploadBusy(false);
    if (failed > 0) alert(t('{done} images uploaded. {failed} failed — check console.', { done, failed }));
    await loadSamples();
  };

  // ── Wire upload zone ──────────────────────────────────────────────────────
  const uploadZone = container.querySelector('#gallery-upload-zone');
  const fileInput = container.querySelector('#gallery-file-input');

  uploadZone.addEventListener('click', () => { if (!isUploading) fileInput.click(); });
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!isUploading) uploadZone.classList.add('border-primary', 'bg-primary/5');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('border-primary', 'bg-primary/5'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('border-primary', 'bg-primary/5');
    if (!isUploading) handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', (e) => { handleFiles(e.target.files); e.target.value = ''; });

  // ── Load projects ─────────────────────────────────────────────────────────
  const loadProjects = async () => {
    try {
      const res = await api.get('/projects');
      if (res.success) {
        projects = res.data;
        const select = getSelect();
        select.innerHTML = `<option value="">${t('— Choose a project —')}</option>` +
          projects.map(p => `<option value="${p._id}">${p.title}</option>`).join('');
      }
    } catch (err) { console.error(err); }
  };

  getSelect().addEventListener('change', async (e) => {
    selectedProjectId = e.target.value || null;
    if (selectedProjectId) { getPanel().classList.remove('hidden'); await loadSamples(); }
    else { getPanel().classList.add('hidden'); currentSamples = []; }
  });

  loadProjects();
  return container;
}

// ── Settings Page ───────────────────────────────────────────────────────────
export function createSettingsPage(fields) {
  const container = document.createElement('div');
  container.className = 'space-y-6 max-w-4xl';

  container.innerHTML = `
    <div class="mb-6">
      <h2 class="text-3xl font-bold">${t('System Settings')}</h2>
      <p class="text-textMuted mt-1">${t('Configure global dashboard preferences here.')}</p>
    </div>
  `;

  const formWrapper = document.createElement('div');
  formWrapper.className = 'glass-panel p-6';
  formWrapper.innerHTML = `
    <form id="settings-form" class="space-y-4">
      <div id="settings-fields" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      <div class="flex justify-end pt-4 border-t border-border mt-6">
        <button type="submit"
          class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
          <i class="ph ph-floppy-disk"></i> ${t('Save Settings')}
        </button>
      </div>
    </form>
  `;
  container.appendChild(formWrapper);

  const renderFields = (item) => {
    const formFields = container.querySelector('#settings-fields');
    formFields.innerHTML = fields.map(field => {
      const val = item ? (item[field.key] || '') : '';
      const safeKey = field.key.replace(/\./g, '_');
      const span = field.type === 'textarea' ? 'md:col-span-2' : 'col-span-1';

      if (field.type === 'textarea') return `
        <div class="${span}">
          <label class="block text-sm font-medium text-textMuted mb-1">${t(field.label)}</label>
          <textarea id="setting-${safeKey}" rows="4"
            class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-textMain">${val}</textarea>
        </div>`;

      return `
        <div class="${span}">
          <label class="block text-sm font-medium text-textMuted mb-1">${t(field.label)}</label>
          <input type="${field.type === 'number' ? 'number' : 'text'}" id="setting-${safeKey}" value="${val}"
            class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-textMain">
        </div>`;
    }).join('');
  };

  const loadSettings = async () => {
    const res = await api.get('/settings');
    renderFields(res.success && res.data ? res.data : {});
  };

  container.querySelector('#settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {};
    fields.forEach(field => {
      const safeKey = field.key.replace(/\./g, '_');
      const input = container.querySelector(`#setting-${safeKey}`);
      payload[field.key] = field.type === 'number' ? Number(input.value) : input.value;
    });

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="ph ph-spinner animate-spin me-2"></i> ${t('Saving...')}`;
    submitBtn.disabled = true;
    try {
      const res = await api.put('/settings', payload);
      if (res.success) alert(t('Settings saved successfully!'));
    } catch (err) {
      alert(t('Error saving settings: {message}', { message: err.message }));
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  });

  loadSettings();
  return container;
}
