const apiBase = 'http://localhost:3000/api'; // ubah jika berbeda
const map = L.map('map').setView([-6.2000, 106.8166], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markersLayer = L.layerGroup().addTo(map);

async function fetchFacilities(params = {}) {
    const url = new URL(apiBase + '/facilities');
    Object.keys(params).forEach(k => params[k] ? url.searchParams.append(k, params[k]) : null);
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
}

function showResults(list) {
    markersLayer.clearLayers();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    list.forEach(item => {
    const marker = L.marker([item.latitude, item.longitude]).addTo(markersLayer);
    marker.bindPopup(`<b>${item.name}</b><br/>${item.category}<br/>${item.address || ''}`);
    marker.on('click', () => {
        map.setView([item.latitude, item.longitude], 16);
    });

    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `<b>${item.name}</b> — ${item.category} <br/><small>${item.address || ''}</small>`;
    div.onclick = () => {
        map.setView([item.latitude, item.longitude], 16);
        marker.openPopup();
    };
    resultsDiv.appendChild(div);
    });
}

async function search() {
    const category = document.getElementById('category').value;
    const q = document.getElementById('q').value;
    const data = await fetchFacilities({ category: category || '', q: q || '' });
    showResults(data);
}

document.getElementById('searchBtn').addEventListener('click', search);
document.getElementById('refreshBtn').addEventListener('click', () => search());

// load all on start
window.onload = () => search();

// Add new facility form
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
    name: document.getElementById('name').value,
    category: document.getElementById('cat').value,
    address: document.getElementById('addr').value,
    latitude: parseFloat(document.getElementById('lat').value),
    longitude: parseFloat(document.getElementById('lng').value),
    phone: document.getElementById('phone').value,
    description: document.getElementById('desc').value
    };
    const res = await fetch(apiBase + '/facilities', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
    });
    const j = await res.json();
    alert('Ditambahkan dengan ID: ' + (j.data && j.data.id));
    search();
});

// Optional: let user click map to fill coords
map.on('click', function(e) {
    document.getElementById('lat').value = e.latlng.lat.toFixed(6);
    document.getElementById('lng').value = e.latlng.lng.toFixed(6);
});