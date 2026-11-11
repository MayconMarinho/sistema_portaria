const accessRecords = [
    { date: '2025-05-18', time: '14:28:42', name: 'Paulo Mendes', kind: 'Visitante', method: 'QR Code', location: 'Portaria 01', status: 'Autorizado' },
    { date: '2025-05-18', time: '14:16:09', name: 'Ana Costa', kind: 'Prestador', method: 'Manual', location: 'Portaria 01', status: 'Autorizado' },
    { date: '2025-05-18', time: '13:52:31', name: 'Rafael Lima', kind: 'Morador', method: 'QR Code', location: 'Garagem', status: 'Autorizado' },
    { date: '2025-05-18', time: '12:47:18', name: 'Código inválido', kind: 'Não identificado', method: 'QR Code', location: 'Portaria 01', status: 'Negado' },
    { date: '2025-05-18', time: '11:35:02', name: 'Beatriz Souza', kind: 'Visitante', method: 'QR Code', location: 'Portaria 02', status: 'Autorizado' },
    { date: '2025-05-18', time: '10:12:55', name: 'Carlos Freire', kind: 'Entregador', method: 'Manual', location: 'Serviço', status: 'Autorizado' },
    { date: '2025-05-17', time: '18:42:16', name: 'Amanda Lima', kind: 'Morador', method: 'QR Code', location: 'Portaria 01', status: 'Autorizado' },
    { date: '2025-05-17', time: '17:28:04', name: 'Lucas Ferreira', kind: 'Visitante', method: 'QR Code', location: 'Portaria 02', status: 'Autorizado' },
    { date: '2025-05-17', time: '16:10:33', name: 'Marcos Oliveira', kind: 'Prestador', method: 'Manual', location: 'Serviço', status: 'Autorizado' },
    { date: '2025-05-17', time: '15:02:19', name: 'Credencial expirada', kind: 'Não identificado', method: 'QR Code', location: 'Portaria 01', status: 'Negado' },
    { date: '2025-05-17', time: '14:35:47', name: 'Fernanda Alves', kind: 'Visitante', method: 'QR Code', location: 'Portaria 01', status: 'Autorizado' },
    { date: '2025-05-17', time: '13:21:08', name: 'Roberto Dias', kind: 'Morador', method: 'QR Code', location: 'Garagem', status: 'Autorizado' },
    { date: '2025-05-16', time: '18:13:52', name: 'Patricia Gomes', kind: 'Visitante', method: 'QR Code', location: 'Portaria 02', status: 'Autorizado' },
    { date: '2025-05-16', time: '16:47:29', name: 'Documento inválido', kind: 'Não identificado', method: 'Manual', location: 'Portaria 01', status: 'Negado' },
    { date: '2025-05-16', time: '15:08:11', name: 'Bruno Martins', kind: 'Entregador', method: 'Manual', location: 'Serviço', status: 'Autorizado' },
    { date: '2025-05-16', time: '14:20:36', name: 'Camila Rocha', kind: 'Prestador', method: 'QR Code', location: 'Portaria 01', status: 'Autorizado' },
    { date: '2025-05-16', time: '12:51:44', name: 'Daniel Souza', kind: 'Morador', method: 'QR Code', location: 'Garagem', status: 'Autorizado' },
    { date: '2025-05-16', time: '11:03:27', name: 'Acesso não autorizado', kind: 'Não identificado', method: 'QR Code', location: 'Portaria 02', status: 'Negado' }
];

const users = [
    { name: 'Marina Silva', email: 'marina@safeaccess.com', role: 'Administradora', status: 'Ativo', lastAccess: 'Hoje, 14:30' },
    { name: 'Rafael Costa', email: 'rafael@safeaccess.com', role: 'Operador', status: 'Ativo', lastAccess: 'Hoje, 12:18' },
    { name: 'Amanda Lima', email: 'amanda@safeaccess.com', role: 'Operador', status: 'Ativo', lastAccess: 'Ontem, 18:42' },
    { name: 'Felipe Martins', email: 'felipe@safeaccess.com', role: 'Visualizador', status: 'Inativo', lastAccess: '12 mai, 09:15' },
    { name: 'João Santos', email: 'joao@safeaccess.com', role: 'Operador', status: 'Ativo', lastAccess: '10 mai, 16:20' }
];

const navLabels = {
    scanner: ['Operação', 'Leitor QR Code'],
    visitantes: ['Operação', 'Registrar Visitante'],
    usuarios: ['Administração', 'Gerenciar Usuários'],
    logs: ['Administração', 'Logs de Acesso']
};
const pageSize = 6;
let currentLogPage = 1;
let html5QrcodeScanner;
let dailyAccessCount = 128;
let authorizedCount = 124;
let deniedCount = 4;

function changeTab(tabId) {
    const page = document.getElementById(tabId);
    const button = document.getElementById(`btn-${tabId}`);
    if (!page || !button) return;

    document.querySelectorAll('.page').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(navButton => navButton.classList.remove('active'));
    page.classList.add('active');
    button.classList.add('active');

    const [sectionLabel, pageLabel] = navLabels[tabId];
    document.getElementById('breadcrumb-section').textContent = sectionLabel;
    document.getElementById('breadcrumb-page').textContent = pageLabel;

    if (tabId === 'scanner') startScanner();
    else stopScanner();
}

function startScanner() {
    if (html5QrcodeScanner || typeof Html5QrcodeScanner === 'undefined') return;

    html5QrcodeScanner = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.777
    }, false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

function stopScanner() {
    if (!html5QrcodeScanner) return;

    const scanner = html5QrcodeScanner;
    html5QrcodeScanner = null;
    scanner.clear().catch(error => console.error('Falha ao parar o scanner.', error));
}

function onScanSuccess(decodedText) {
    stopScanner();
    const isValid = decodedText.trim().length > 0;
    addAccessRecord({
        date: getTodayIso(),
        time: getCurrentTime(),
        name: isValid ? 'Credencial identificada' : 'Código inválido',
        kind: isValid ? 'Visitante' : 'Não identificado',
        method: 'QR Code',
        location: 'Portaria 01',
        status: isValid ? 'Autorizado' : 'Negado'
    });
    showModal(
        isValid ? 'Acesso autorizado' : 'Acesso negado',
        isValid ? 'Credencial validada. A entrada foi registrada.' : 'Não foi possível validar esta credencial.'
    );
    setTimeout(() => {
        if (document.getElementById('scanner').classList.contains('active')) startScanner();
    }, 3000);
}

function onScanFailure() {
    // A biblioteca reporta tentativas sem leitura continuamente.
}

function liberarAcessoManual() {
    addAccessRecord({
        date: getTodayIso(),
        time: getCurrentTime(),
        name: 'Acesso manual',
        kind: 'Não identificado',
        method: 'Manual',
        location: 'Portaria 01',
        status: 'Autorizado'
    });
    showModal('Acesso autorizado', 'A liberação manual foi registrada nos logs.');
}

function getTodayIso() {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour12: false });
}

function formatShortDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function getInitials(name) {
    return name.split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase();
}

function addAccessRecord(record) {
    accessRecords.unshift(record);
    if (record.status === 'Autorizado') authorizedCount += 1;
    else deniedCount += 1;
    dailyAccessCount += 1;
    currentLogPage = 1;
    renderLogs();
    renderRecentAccesses();
    updateLogStats();
}

function renderRecentAccesses() {
    const list = document.getElementById('recent-access-list');
    list.replaceChildren();

    accessRecords.slice(0, 3).forEach(record => {
        const row = document.createElement('div');
        row.className = 'recent-entry';
        const icon = document.createElement('span');
        icon.className = `recent-entry-icon${record.method === 'Manual' ? ' manual' : ''}`;
        const iconGlyph = document.createElement('i');
        iconGlyph.className = `fa-solid ${record.method === 'Manual' ? 'fa-user-plus' : 'fa-check'}`;
        icon.appendChild(iconGlyph);

        const copy = document.createElement('span');
        copy.className = 'recent-entry-copy';
        const name = document.createElement('strong');
        name.textContent = record.name;
        const meta = document.createElement('small');
        meta.textContent = `${record.kind} · ${record.time.slice(0, 5)}`;
        copy.append(name, meta);

        const status = document.createElement('small');
        status.className = 'recent-entry-status';
        status.textContent = record.method === 'Manual' ? 'Manual' : record.status;
        row.append(icon, copy, status);
        list.appendChild(row);
    });
}

function updateLogStats() {
    document.querySelector('#logs .log-stats article:nth-child(1) strong').textContent = dailyAccessCount;
    document.querySelector('#logs .log-stats article:nth-child(2) strong').textContent = authorizedCount;
    document.querySelector('#logs .log-stats article:nth-child(3) strong').textContent = deniedCount;
}

function getFilteredLogs() {
    const query = document.getElementById('log-search').value.trim().toLocaleLowerCase('pt-BR');
    const date = document.getElementById('log-date-filter').value;
    const status = document.getElementById('log-status-filter').value;
    return accessRecords.filter(record => {
        const searchable = `${record.name} ${record.kind} ${record.method} ${record.location}`.toLocaleLowerCase('pt-BR');
        return (!query || searchable.includes(query))
            && (!date || record.date === date)
            && (!status || record.status === status);
    });
}

function renderLogs() {
    const filtered = getFilteredLogs();
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentLogPage = Math.min(currentLogPage, pages);
    const start = (currentLogPage - 1) * pageSize;
    const visible = filtered.slice(start, start + pageSize);
    const body = document.getElementById('logs-body');
    body.replaceChildren();

    visible.forEach(record => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const dateCopy = document.createElement('span');
        dateCopy.className = 'date-copy';
        dateCopy.textContent = record.time;
        const dateHint = document.createElement('small');
        dateHint.textContent = record.date === getTodayIso() ? 'Hoje' : formatShortDate(record.date);
        dateCell.append(dateCopy, dateHint);

        const personCell = document.createElement('td');
        const person = document.createElement('span');
        person.className = 'person-cell';
        const avatar = document.createElement('span');
        avatar.className = `person-avatar${record.status === 'Negado' ? ' denied' : ''}`;
        avatar.textContent = getInitials(record.name);
        const copy = document.createElement('span');
        copy.className = 'person-copy';
        const name = document.createElement('strong');
        name.textContent = record.name;
        const kind = document.createElement('small');
        kind.textContent = record.kind;
        copy.append(name, kind);
        person.append(avatar, copy);
        personCell.appendChild(person);

        const methodCell = document.createElement('td');
        const method = document.createElement('span');
        method.className = 'method-pill';
        const methodIcon = document.createElement('i');
        methodIcon.className = `fa-solid ${record.method === 'Manual' ? 'fa-hand' : 'fa-qrcode'}`;
        method.append(methodIcon, document.createTextNode(record.method));
        methodCell.appendChild(method);

        const locationCell = document.createElement('td');
        locationCell.textContent = record.location;

        const statusCell = document.createElement('td');
        const status = document.createElement('span');
        status.className = `status-pill${record.status === 'Negado' ? ' denied' : ''}`;
        status.textContent = record.status;
        statusCell.appendChild(status);

        const actionCell = document.createElement('td');
        const action = document.createElement('i');
        action.className = 'fa-solid fa-chevron-right row-arrow';
        actionCell.appendChild(action);
        row.append(dateCell, personCell, methodCell, locationCell, statusCell, actionCell);
        body.appendChild(row);
    });

    const recordTotal = filtered.length === accessRecords.length ? dailyAccessCount : filtered.length;
    document.getElementById('logs-count').textContent = filtered.length
        ? `Mostrando ${start + 1}–${start + visible.length} de ${recordTotal} registros`
        : 'Nenhum registro encontrado';
    renderPagination(pages);
}

function renderPagination(pageCount) {
    const pagination = document.getElementById('logs-pagination');
    pagination.replaceChildren();
    const addButton = (label, page, disabled = false, current = false) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.disabled = disabled;
        if (current) button.className = 'current-page';
        button.addEventListener('click', () => {
            currentLogPage = page;
            renderLogs();
        });
        pagination.appendChild(button);
    };

    addButton('‹', currentLogPage - 1, currentLogPage === 1);
    for (let page = 1; page <= pageCount; page += 1) {
        addButton(String(page), page, false, page === currentLogPage);
    }
    addButton('›', currentLogPage + 1, currentLogPage === pageCount);
}

function getFilteredUsers() {
    const query = document.getElementById('user-search').value.trim().toLocaleLowerCase('pt-BR');
    const role = document.getElementById('user-role-filter').value;
    const status = document.getElementById('user-status-filter').value;
    return users.filter(user => {
        const searchable = `${user.name} ${user.email} ${user.role}`.toLocaleLowerCase('pt-BR');
        return (!query || searchable.includes(query))
            && (!role || user.role === role)
            && (!status || user.status === status);
    });
}

function renderUsers() {
    const filtered = getFilteredUsers();
    const body = document.getElementById('users-body');
    body.replaceChildren();

    filtered.forEach(user => {
        const row = document.createElement('tr');
        const userCell = document.createElement('td');
        const person = document.createElement('span');
        person.className = 'person-cell';
        const avatar = document.createElement('span');
        avatar.className = 'person-avatar';
        avatar.textContent = getInitials(user.name);
        const copy = document.createElement('span');
        copy.className = 'person-copy';
        const name = document.createElement('strong');
        name.textContent = user.name;
        const email = document.createElement('small');
        email.textContent = user.email;
        copy.append(name, email);
        person.append(avatar, copy);
        userCell.appendChild(person);

        const roleCell = document.createElement('td');
        const role = document.createElement('span');
        role.className = 'role-pill';
        role.textContent = user.role;
        roleCell.appendChild(role);

        const statusCell = document.createElement('td');
        const status = document.createElement('span');
        status.className = `status-pill${user.status === 'Inativo' ? ' inactive' : ''}`;
        status.textContent = user.status;
        statusCell.appendChild(status);

        const lastAccessCell = document.createElement('td');
        lastAccessCell.textContent = user.lastAccess;

        const actionsCell = document.createElement('td');
        const actionButton = document.createElement('button');
        actionButton.type = 'button';
        actionButton.className = 'row-menu';
        actionButton.setAttribute('aria-label', `Ações para ${user.name}`);
        const actionIcon = document.createElement('i');
        actionIcon.className = 'fa-solid fa-ellipsis';
        actionButton.appendChild(actionIcon);
        actionsCell.appendChild(actionButton);
        row.append(userCell, roleCell, statusCell, lastAccessCell, actionsCell);
        body.appendChild(row);
    });

    document.getElementById('users-count').textContent = `Mostrando ${filtered.length} de ${users.length} usuários`;
    const activeCount = users.filter(user => user.status === 'Ativo').length;
    const adminCount = users.filter(user => user.role === 'Administradora').length;
    document.getElementById('users-total').textContent = users.length;
    document.getElementById('active-users-total').textContent = activeCount;
    document.getElementById('admins-total').textContent = adminCount;
}

function openUserModal() {
    document.getElementById('user-modal').classList.add('active');
    document.getElementById('usr-nome').focus();
}

function closeUserModal() {
    document.getElementById('user-modal').classList.remove('active');
    document.getElementById('form-usuario').reset();
}

function showModal(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-msg').textContent = message;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function exportLogs() {
    const rows = getFilteredLogs();
    const csvRows = [
        ['Data', 'Hora', 'Pessoa', 'Tipo', 'Método', 'Local', 'Status'],
        ...rows.map(record => [
            formatShortDate(record.date),
            record.time,
            record.name,
            record.kind,
            record.method,
            record.location,
            record.status
        ])
    ];
    const csv = csvRows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\r\n');
    const file = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'logs-de-acesso.csv';
    link.click();
    URL.revokeObjectURL(link.href);
}

document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', () => changeTab(button.dataset.tab));
});

document.querySelectorAll('[data-open-tab]').forEach(button => {
    button.addEventListener('click', () => changeTab(button.dataset.openTab));
});

document.getElementById('form-visitante').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const visitorName = String(formData.get('nome')).trim();
    const visitDate = String(formData.get('data'));
    const visitTime = String(formData.get('horario'));
    addAccessRecord({
        date: visitDate,
        time: visitTime.length === 5 ? `${visitTime}:00` : visitTime,
        name: visitorName,
        kind: String(formData.get('tipo')),
        method: 'QR Code',
        location: String(formData.get('destino')),
        status: 'Autorizado'
    });
    event.currentTarget.reset();
    document.getElementById('vis-data').value = getTodayIso();
    showModal('Acesso cadastrado', `A autorização de ${visitorName} foi criada e registrada nos logs.`);
});

document.getElementById('form-usuario').addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('usr-nome').value.trim();
    users.unshift({
        name,
        email: document.getElementById('usr-email').value.trim(),
        role: document.getElementById('usr-perfil').value,
        status: 'Ativo',
        lastAccess: 'Nunca acessou'
    });
    renderUsers();
    closeUserModal();
    showModal('Usuário cadastrado', `${name} agora tem acesso ao sistema.`);
});

document.getElementById('new-user-button').addEventListener('click', openUserModal);
document.getElementById('new-user-button-secondary').addEventListener('click', openUserModal);
document.getElementById('close-user-modal').addEventListener('click', closeUserModal);
document.getElementById('cancel-user-modal').addEventListener('click', closeUserModal);
document.getElementById('user-modal').addEventListener('click', event => {
    if (event.target.id === 'user-modal') closeUserModal();
});
document.getElementById('user-search').addEventListener('input', renderUsers);
document.getElementById('user-role-filter').addEventListener('change', renderUsers);
document.getElementById('user-status-filter').addEventListener('change', renderUsers);
document.getElementById('log-search').addEventListener('input', () => {
    currentLogPage = 1;
    renderLogs();
});
document.getElementById('log-date-filter').addEventListener('change', () => {
    currentLogPage = 1;
    renderLogs();
});
document.getElementById('log-status-filter').addEventListener('change', () => {
    currentLogPage = 1;
    renderLogs();
});
document.getElementById('export-logs').addEventListener('click', exportLogs);
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
        if (event.target === modal && modal.id === 'modal') closeModal();
    });
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeModal();
        closeUserModal();
    }
});

function updateClocks() {
    const now = new Date();
    document.getElementById('scanner-clock').textContent = `Hoje, ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    document.getElementById('camera-clock').textContent = now.toLocaleString('sv-SE').replace('T', ' ');
}

document.getElementById('vis-data').value = getTodayIso();
renderRecentAccesses();
renderLogs();
renderUsers();
updateLogStats();
updateClocks();
setInterval(updateClocks, 1000);
startScanner();
