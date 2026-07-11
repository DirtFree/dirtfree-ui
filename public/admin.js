const ADMIN_STATUS_OVERRIDES_KEY = 'dirtfree_admin_status_overrides';
const orderStatuses = {
  done: 'Done',
  completed: 'Done',
  pending: 'Pending',
  waiting: 'Pending'
};

const ADMIN_CITIES = ['Ahmedabad', 'Betul', 'Chennai', 'Ghaziabad', 'Indore'];

let adminOrders = [];
let hasStatusColumn = false;
let statusOverrides = JSON.parse(localStorage.getItem(ADMIN_STATUS_OVERRIDES_KEY) || '{}');

function saveStatusOverrides() {
  localStorage.setItem(ADMIN_STATUS_OVERRIDES_KEY, JSON.stringify(statusOverrides));
}

function getOrderStatus(order) {
  const override = statusOverrides[order.id];
  if (override) return override.toLowerCase();
  const rawStatus = order.status ?? order.order_status ?? order.status_text ?? order.state;
  if (!rawStatus) return 'pending';
  return String(rawStatus).trim().toLowerCase();
}

function isDoneOrder(order) {
  const status = getOrderStatus(order);
  return status === 'done' || status === 'completed';
}

function getCustomerName(order) {
  const fallbackName = [
    order.customer_name,
    order.customerName,
    order.name,
    order.user?.full_name,
    [order.user?.first_name, order.user?.last_name].filter(Boolean).join(' ').trim()
  ].find(Boolean);

  if (fallbackName) return String(fallbackName).trim();

  return order.customer_phone || order.phone || order.userPhone || order.user?.mobile || 'Guest';
}

function getStatusLabel(status) {
  return orderStatuses[status] || (status === 'done' ? 'Done' : 'Pending');
}

function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function parseCartItems(order) {
  const raw = order.cart_items ?? order.cartItems;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string') return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function renderSummary(orders) {
  const total = orders.length;
  const done = orders.filter(order => getOrderStatus(order) === 'done' || getOrderStatus(order) === 'completed').length;
  const pending = total - done;
  const cities = new Set(orders.map(order => (order.location || 'Unknown').trim())).size;

  document.getElementById('totalOrders').textContent = total;
  document.getElementById('doneOrders').textContent = done;
  document.getElementById('pendingOrders').textContent = pending;
  document.getElementById('cityCount').textContent = cities;
}

function buildCityOptions(orders) {
  const cityFilter = document.getElementById('cityFilter');
  const orderCities = orders.map(order => (order.location || 'Unknown').trim());
  const cities = Array.from(new Set([...ADMIN_CITIES, ...orderCities])).sort();
  const currentValue = cityFilter.value;

  cityFilter.innerHTML = '<option value="all">All cities</option>' + cities.map(city => `<option value="${city}">${city}</option>`).join('');
  cityFilter.value = cities.includes(currentValue) ? currentValue : 'all';
}

function showLoginError(message) {
  const errorNode = document.getElementById('adminLoginError');
  errorNode.textContent = message;
}

function clearLoginError() {
  showLoginError('');
}

function showDashboard() {
  document.getElementById('adminLoginSection').classList.add('hidden');
  document.getElementById('adminHeroSection').classList.remove('hidden');
  document.getElementById('adminDashboardSection').classList.remove('hidden');
}

function hideDashboard() {
  document.getElementById('adminLoginSection').classList.remove('hidden');
  document.getElementById('adminHeroSection').classList.add('hidden');
  document.getElementById('adminDashboardSection').classList.add('hidden');
}

async function verifyAdminCredentials(username, password) {
  if (!window.supabase) {
    throw new Error('Supabase is not initialized');
  }

  const { data, error } = await window.supabase
    .from('admin')
    .select('id, user_name, password')
    .eq('user_name', username)
    .limit(1)
    .single();

  if (error) {
    console.warn('Supabase admin query failed:', error);
    throw new Error('Unable to verify admin credentials.');
  }

  if (!data || data.password !== password) {
    throw new Error('Invalid username or password.');
  }

  return true;
}

async function handleAdminLogin(event) {
  event.preventDefault();
  clearLoginError();

  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;

  if (!username || !password) {
    showLoginError('Please enter both username and password.');
    return;
  }

  const loginButton = document.querySelector('.admin-login-btn');
  loginButton.disabled = true;

  try {
    await verifyAdminCredentials(username, password);
    showDashboard();
    initAdminDashboard();
  } catch (err) {
    showLoginError(err.message || 'Login failed.');
    loginButton.disabled = false;
  }
}

function handleAdminLogout() {
  hideDashboard();
  document.getElementById('adminUsername').value = '';
  document.getElementById('adminPassword').value = '';
}

let adminServices = [];
let serviceTableAvailable = false;
let serviceLocationFilter = 'all';

function showPanel(panelId) {
  document.querySelectorAll('.admin-panel').forEach(panel => panel.classList.add('hidden'));
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.remove('hidden');
}

function bindAdminTabs() {
  document.querySelectorAll('.admin-tabs .tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.admin-tabs .tab-btn').forEach(tab => tab.classList.remove('active'));
      button.classList.add('active');
      showPanel(button.dataset.panel);
    });
  });
}

function parseListField(fieldId) {
  const value = document.getElementById(fieldId)?.value || '';
  return value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);
}

function normalizeLocationValue(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return '';
  return normalized === 'all locations' ? 'all' : normalized;
}

function getServiceFormValues() {
  const priceValue = document.getElementById('servicePrice').value;
  return {
    id: document.getElementById('serviceId').value || null,
    location: normalizeLocationValue(document.getElementById('serviceLocation').value),
    category: document.getElementById('serviceCategory').value.trim(),
    name: document.getElementById('serviceName').value.trim(),
    title: document.getElementById('serviceTitle').value.trim(),
    tier: document.getElementById('serviceTier').value.trim(),
    price: priceValue === '' ? null : Number(priceValue),
    duration: document.getElementById('serviceDuration').value.trim(),
    badge: document.getElementById('serviceBadge').value.trim(),
    image: document.getElementById('serviceImage').value.trim(),
    included: parseListField('serviceIncluded'),
    excluded: parseListField('serviceExcluded'),
    description: document.getElementById('serviceDescription').value.trim(),
    active: document.getElementById('serviceActive').checked
  };
}

function clearServiceForm() {
  document.getElementById('serviceId').value = '';
  document.getElementById('serviceLocation').value = 'all';
  document.getElementById('serviceCategory').value = '';
  document.getElementById('serviceName').value = '';
  document.getElementById('serviceTitle').value = '';
  document.getElementById('serviceTier').value = '';
  document.getElementById('servicePrice').value = '';
  document.getElementById('serviceDuration').value = '';
  document.getElementById('serviceBadge').value = '';
  document.getElementById('serviceImage').value = '';
  document.getElementById('serviceIncluded').value = '';
  document.getElementById('serviceExcluded').value = '';
  document.getElementById('serviceDescription').value = '';
  document.getElementById('serviceActive').checked = true;
  showServiceFormMessage('');
}

function showServiceFormMessage(message, type = 'info') {
  const messageNode = document.getElementById('serviceFormMessage');
  if (!messageNode) return;
  messageNode.textContent = message;
  messageNode.className = `service-form-message service-form-${type}`;
}

function buildServiceLocationOptions(services) {
  const filterNode = document.getElementById('serviceLocationFilter');
  if (!filterNode) return;

  const locations = Array.from(new Set([
    ...services.map(service => normalizeLocationValue(service.location)).filter(Boolean),
    ...ADMIN_CITIES.map(city => normalizeLocationValue(city))
  ])).sort();

  const currentValue = serviceLocationFilter || 'all';
  filterNode.innerHTML = '<option value="all">All locations</option>' + locations.map((location) => {
    const label = location === 'all' ? 'All locations' : capitalize(location);
    return `<option value="${location}">${label}</option>`;
  }).join('');

  filterNode.value = locations.includes(currentValue) ? currentValue : 'all';
  serviceLocationFilter = filterNode.value;
}

function getVisibleServices(services) {
  if (serviceLocationFilter === 'all') return services;
  return services.filter((service) => normalizeLocationValue(service.location) === serviceLocationFilter);
}

function renderServiceList(services) {
  const serviceList = document.getElementById('serviceList');
  if (!serviceList) return;

  const visibleServices = getVisibleServices(services);
  serviceList.innerHTML = buildServiceList(visibleServices);
  bindServiceListActions();
}

function buildServiceList(services) {
  if (!services.length) {
    return '<div class="no-orders">No services found. Add a new service to get started.</div>';
  }

  return services
    .map((service) => {
      return `
        <article class="service-item-card">
          <div class="service-item-summary">
            <div>
              <p class="service-item-label">${escapeHtml(service.category)} / ${escapeHtml(service.name)}</p>
              <h4>${escapeHtml(service.tier)}</h4>
            </div>
            <div class="service-item-meta">
              <span>${service.price !== null ? `₹${service.price}` : 'No price'}</span>
              <span>${service.locationSummary ? escapeHtml(service.locationSummary) : 'Unknown location'}</span>
              <span>${service.active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          <div class="service-item-actions">
            <button type="button" class="card-btn small" data-action="edit" data-service-id="${service.id}">Edit</button>
            <button type="button" class="card-btn secondary small" data-action="delete" data-service-id="${service.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function bindServiceListActions() {
  document.querySelectorAll('#serviceList [data-action]').forEach(button => {
    button.addEventListener('click', () => {
      const serviceId = button.dataset.serviceId;
      const action = button.dataset.action;
      const service = adminServices.find(item => String(item.id) === String(serviceId));
      if (!service) return;

      if (action === 'edit') {
        populateServiceForm(service);
      } else if (action === 'delete') {
        deleteService(serviceId);
      }
    });
  });
}

async function deleteService(serviceId) {
  if (!window.supabase) {
    showServiceFormMessage('Supabase is not available. Delete cannot be completed.', 'warning');
    return;
  }

  if (!confirm('Delete this service? This cannot be undone.')) {
    return;
  }

  const { error } = await window.supabase.from('services').delete().eq('id', serviceId);

  if (error) {
    showServiceFormMessage('Unable to delete service. Check console for details.', 'warning');
    console.warn('Service delete failed:', error);
    return;
  }

  showServiceFormMessage('Service removed successfully.', 'success');
  await loadServices();
  clearServiceForm();
}

async function loadServices() {
  const serviceList = document.getElementById('serviceList');
  if (serviceList) {
    serviceList.innerHTML = '<div class="no-orders">Loading services…</div>';
  }

  if (!window.supabase) {
    showServiceFormMessage('Supabase is not initialized. Service catalog cannot be loaded.', 'warning');
    adminServices = [];
    if (serviceList) serviceList.innerHTML = buildServiceList(adminServices);
    return;
  }

  const { data, error } = await window.supabase
    .from('services')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })
    .order('tier', { ascending: true });

  if (error) {
    showServiceFormMessage('Unable to load services from Supabase.', 'warning');
    console.warn('Service load failed:', error);
    adminServices = [];
    if (serviceList) serviceList.innerHTML = buildServiceList(adminServices);
    return;
  }

  adminServices = Array.isArray(data) ? data : [];
  adminServices = adminServices.map((service) => ({
    ...service,
    locationSummary: normalizeLocationValue(service.location) === 'all' || !service.location ? 'All locations' : capitalize(service.location)
  }));
  serviceTableAvailable = true;
  buildServiceLocationOptions(adminServices);
  renderServiceList(adminServices);
  showServiceFormMessage('Service catalog loaded.', 'success');
}

function capitalize(value) {
  return String(value || '').replace(/\b\w/g, (char) => char.toUpperCase());
}

function populateServiceForm(service) {
  document.getElementById('serviceId').value = service.id || '';
  document.getElementById('serviceLocation').value = normalizeLocationValue(service.location) || 'all';
  document.getElementById('serviceCategory').value = service.category || '';
  document.getElementById('serviceName').value = service.name || '';
  document.getElementById('serviceTitle').value = service.title || '';
  document.getElementById('serviceTier').value = service.tier || '';
  document.getElementById('servicePrice').value = service.price != null ? service.price : '';
  document.getElementById('serviceDuration').value = service.duration || '';
  document.getElementById('serviceBadge').value = service.badge || '';
  document.getElementById('serviceImage').value = service.image || '';
  document.getElementById('serviceIncluded').value = Array.isArray(service.included) ? service.included.join('\n') : '';
  document.getElementById('serviceExcluded').value = Array.isArray(service.excluded) ? service.excluded.join('\n') : '';
  document.getElementById('serviceDescription').value = service.description || '';
  document.getElementById('serviceActive').checked = service.active !== false;
}

async function handleServiceFormSubmit(event) {
  event.preventDefault();
  const values = getServiceFormValues();

  if (!values.category || !values.name || !values.tier || !values.location) {
    showServiceFormMessage('Category, service name, tier, and location are required.', 'warning');
    return;
  }

  if (!window.supabase) {
    showServiceFormMessage('Supabase is not initialized. Service changes cannot be saved.', 'warning');
    return;
  }

  const payload = {
    location: values.location,
    category: values.category,
    name: values.name,
    title: values.title || values.name,
    tier: values.tier,
    price: values.price,
    duration: values.duration,
    badge: values.badge,
    image: values.image,
    description: values.description,
    details_summary: values.description,
    included: values.included,
    excluded: values.excluded,
    active: values.active
  };

  if (values.id) {
    const { error } = await window.supabase.from('services').update(payload).eq('id', values.id);
    if (error) {
      showServiceFormMessage('Unable to update service.', 'warning');
      console.warn('Service update failed:', error);
      return;
    }

    showServiceFormMessage('Service updated successfully.', 'success');
    await loadServices();
    clearServiceForm();
    return;
  }

  const { data: insertedData, error } = await window.supabase.from('services').insert([payload]).select().single();
  if (error) {
    showServiceFormMessage('Unable to save new service.', 'warning');
    console.warn('Service save failed:', error);
    return;
  }

  showServiceFormMessage('Service added successfully.', 'success');
  await loadServices();
  clearServiceForm();
}

function groupOrdersByCity(orders) {
  return orders.reduce((acc, order) => {
    const city = (order.location || 'Unknown').trim();
    if (!acc[city]) acc[city] = [];
    acc[city].push(order);
    return acc;
  }, {});
}

function buildStatusSection(title, orders, emptyMessage) {
  if (!orders.length) {
    return `
      <section class="status-section">
        <div class="section-header">
          <div>
            <h3>${title}</h3>
            <p>${emptyMessage}</p>
          </div>
        </div>
        <div class="no-orders">${emptyMessage}</div>
      </section>
    `;
  }

  return `
    <section class="status-section">
      <div class="section-header">
        <div>
          <h3>${title}</h3>
          <p>${orders.length} ${orders.length === 1 ? 'order' : 'orders'}</p>
        </div>
      </div>
      <div class="order-list">
        ${orders.map(buildOrderCard).join('')}
      </div>
    </section>
  `;
}

function buildOrderCard(order) {
  const status = getOrderStatus(order);
  const orderStatus = getStatusLabel(status);
  const isDone = status === 'done' || status === 'completed';
  const orderDate = formatDate(order.created_at || order.date);
  const cartItems = parseCartItems(order);
  const orderService = order.service || (cartItems.length ? 'Cleaning booking' : 'Cleaning service');
  const total = order.total ? `₹${order.total}` : '—';

  const itemsMarkup = cartItems.length
    ? `<div class="order-items">
         <div class="order-items-title">Order items</div>
         <div class="order-items-list">
           ${cartItems.map(item => {
             const itemName = escapeHtml(item.tier || item.service || item.name || 'Cleaning item');
             const itemCount = item.quantity ? `${Number(item.quantity)} × ` : '';
             const itemPrice = item.price ? `₹${item.price}` : '';
             return `<div class="order-item"><span>${itemName}</span><span>${itemCount}${itemPrice}</span></div>`;
           }).join('')}
         </div>
       </div>`
    : '';

  const addressMarkup = order.address ? `
    <div class="order-note">
      <strong>Address:</strong> ${escapeHtml(order.address)}
    </div>
  ` : '';

  return `
    <article class="order-card">
      <div class="order-card-main">
        <div class="order-card-header">
          <div>
            <p class="order-id">Order #${order.id || '—'}</p>
            <h3>${escapeHtml(orderService)}</h3>
          </div>
          <span class="status-pill ${isDone ? 'status-done' : 'status-pending'}">${orderStatus}</span>
        </div>

        <div class="order-meta">
          <span>${escapeHtml(order.location || 'Unknown city')}</span>
          <span>${orderDate}</span>
          <span>${escapeHtml(order.slot || 'No slot')}</span>
          <span>Total: ${total}</span>
        </div>

        ${itemsMarkup}

        <div class="order-note">
          <strong>Customer:</strong> ${escapeHtml(getCustomerName(order))}
        </div>
        ${addressMarkup}
      </div>
      <div class="order-actions">
        <button type="button" data-order-id="${order.id}" data-status="${isDone ? 'pending' : 'done'}" class="status-toggle-btn">
          ${isDone ? 'Mark Pending' : 'Mark Done'}
        </button>
      </div>
    </article>
  `;
}

function renderOrders(orders) {
  const container = document.getElementById('ordersContainer');
  const searchValue = document.getElementById('searchInput').value.trim().toLowerCase();
  const cityFilter = document.getElementById('cityFilter').value;

  const filtered = orders.filter(order => {
    const city = (order.location || 'Unknown').trim();
    const service = (order.service || '').toLowerCase();
    const idValue = String(order.id || '').toLowerCase();
    const searchMatch = !searchValue || service.includes(searchValue) || idValue.includes(searchValue);
    const cityMatch = cityFilter === 'all' || city === cityFilter;
    return searchMatch && cityMatch;
  });

  if (!filtered.length) {
    container.innerHTML = '<div class="no-orders">No orders match the current filter. Try a different city or search term.</div>';
    renderSummary(filtered);
    return;
  }

  const pendingOrders = filtered.filter(order => !isDoneOrder(order));
  const doneOrders = filtered.filter(order => isDoneOrder(order));

  const html = `
    ${buildStatusSection('Active orders', pendingOrders, 'No pending orders at the moment.')}
    ${buildStatusSection('Done orders', doneOrders, 'No completed orders yet.')}
  `;

  container.innerHTML = html;
  renderSummary(filtered);
  bindActionButtons();
}

function showStatusMessage(message, type = 'info') {
  const statusNode = document.getElementById('statusMessage');
  statusNode.textContent = message;
  statusNode.className = `admin-status-message admin-status-${type}`;
  setTimeout(() => {
    if (statusNode.textContent === message) {
      statusNode.textContent = '';
      statusNode.className = 'admin-status-message';
    }
  }, 4500);
}

async function updateOrderStatus(orderId, nextStatus) {
  const button = document.querySelector(`button[data-order-id="${orderId}"]`);
  if (button) button.disabled = true;

  if (!hasStatusColumn) {
    statusOverrides[orderId] = nextStatus;
    saveStatusOverrides();
    renderOrders(adminOrders);
    showStatusMessage('Status updated locally. Add a status column to your orders table for database persistence.', 'warning');
    return;
  }

  try {
    const { data, error } = await window.supabase.from('orders').update({ status: nextStatus }).eq('id', orderId).select().single();
    if (error) {
      throw error;
    }
    if (data) {
      const index = adminOrders.findIndex(order => String(order.id) === String(orderId));
      if (index !== -1) adminOrders[index] = data;
      renderOrders(adminOrders);
      showStatusMessage('Status saved to Supabase successfully.', 'success');
    }
  } catch (err) {
    statusOverrides[orderId] = nextStatus;
    saveStatusOverrides();
    renderOrders(adminOrders);
    showStatusMessage('Could not save status to Supabase; saved locally instead.', 'warning');
    console.warn('Admin status update error:', err);
  }
}

function bindActionButtons() {
  document.querySelectorAll('.status-toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
      const orderId = button.dataset.orderId;
      const nextStatus = button.dataset.status;
      updateOrderStatus(orderId, nextStatus);
    });
  });
}

async function loadOrders() {
  const container = document.getElementById('ordersContainer');
  container.innerHTML = '<div class="no-orders">Loading orders…</div>';

  if (!window.supabase) {
    container.innerHTML = '<div class="no-orders">Supabase is not available. Please check your configuration.</div>';
    return;
  }

  const { data, error } = await window.supabase
    .from('orders')
    .select(`
      *,
      user:user_id(first_name, last_name, mobile)
    `)
    .order('created_at', { ascending: false });
  if (error) {
    container.innerHTML = `<div class="no-orders">Error loading orders: ${error.message || 'Please reload.'}</div>`;
    return;
  }

  adminOrders = Array.isArray(data) ? data : [];
  hasStatusColumn = adminOrders.some(order => Object.prototype.hasOwnProperty.call(order, 'status'));
  buildCityOptions(adminOrders);
  renderOrders(adminOrders);

  const helpNode = document.getElementById('statusMessage');
  if (!hasStatusColumn) {
    helpNode.textContent = 'Your orders table has no status column. The dashboard will still show status locally.';
    helpNode.className = 'admin-status-message admin-status-warning';
  }
}

function initAdminDashboard() {
  document.getElementById('cityFilter').addEventListener('change', () => renderOrders(adminOrders));
  document.getElementById('searchInput').addEventListener('input', () => renderOrders(adminOrders));
  document.getElementById('adminLogoutBtn').addEventListener('click', handleAdminLogout);
  document.getElementById('serviceForm').addEventListener('submit', handleServiceFormSubmit);
  document.getElementById('serviceFormReset').addEventListener('click', clearServiceForm);
  document.getElementById('serviceLocationFilter')?.addEventListener('change', (event) => {
    serviceLocationFilter = event.target.value;
    renderServiceList(adminServices);
  });
  bindAdminTabs();
  loadOrders();
  loadServices();
}

window.addEventListener('DOMContentLoaded', () => {
  hideDashboard();
  document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
});
