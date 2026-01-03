const apiBase = 'http://localhost:3000/api'; // Pastikan port sesuai
const map = L.map('map').setView([-6.2000, 106.8166], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markersLayer = L.layerGroup().addTo(map);

// --- 1. FUNGSI EDIT (BARU) ---
window.startEdit = async (id) => {
    try {
        const res = await fetch(`${apiBase}/facilities/${id}`);
        const json = await res.json();
        const data = json.data;

        if (!data) return alert("Data tidak ditemukan!");

        // 1. Buka Accordion Form
        const details = document.querySelector('details');
        if (details) details.setAttribute('open', true);

        // 2. Isi Form dengan Data Lama
        document.getElementById('editId').value = data.id;
        document.getElementById('name').value = data.name;
        document.getElementById('category').value = data.category;
        document.getElementById('addr').value = data.address || '';
        document.getElementById('lat').value = data.latitude;
        document.getElementById('lng').value = data.longitude;
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('desc').value = data.description || '';

        // 3. Ubah Tampilan jadi Mode Edit
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.textContent = "Update Perubahan";
        saveBtn.style.background = "#f39c12"; // Warna oren
        
        document.getElementById('cancelEditBtn').style.display = "block"; 
        document.getElementById('addForm').classList.add('edit-mode'); 

        // Scroll ke form
        const sidebar = document.querySelector('.sidebar-content');
        if(sidebar) sidebar.scrollTop = sidebar.scrollHeight;

    } catch (err) {
        console.error(err);
        alert("Gagal memuat data untuk diedit.");
    }
};

// --- 2. FUNGSI BATAL EDIT ---
function resetFormState() {
    document.getElementById('addForm').reset();
    document.getElementById('editId').value = ""; 
    
    // Balikin tampilan tombol ke semula
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.textContent = "Simpan Lokasi";
    saveBtn.style.background = "#27ae60"; // Hijau lagi
    
    document.getElementById('cancelEditBtn').style.display = "none";
    document.getElementById('addForm').classList.remove('edit-mode');
    
    const details = document.querySelector('details');
    if(details) details.removeAttribute('open');
}

document.getElementById('cancelEditBtn').addEventListener('click', resetFormState);


// --- 3. FUNGSI DELETE (DENGAN PERBAIKAN SWAL) ---
window.deleteFacility = (id) => {
    Swal.fire({
        title: 'Yakin mau hapus?',
        text: "Data yang dihapus tidak bisa kembali!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
        // --- FIX MAP ILANG ---
        heightAuto: false,       // Jangan ubah tinggi body
        scrollbarPadding: false  // Jangan geser layout
        // ---------------------
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${apiBase}/facilities/${id}`, { method: 'DELETE' });
                const json = await res.json();

                if (res.ok) {
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data lokasi berhasil dihapus.',
                        icon: 'success',
                        heightAuto: false,       // Fix Map
                        scrollbarPadding: false  // Fix Map
                    });
                    search(); // Refresh map
                    
                    if (typeof resetFormState === "function") resetFormState(); 
                } else {
                    Swal.fire({
                        title: 'Gagal!',
                        text: json.error,
                        icon: 'error',
                        heightAuto: false,       // Fix Map
                        scrollbarPadding: false  // Fix Map
                    });
                }
            } catch (err) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Gagal koneksi ke server.',
                    icon: 'error',
                    heightAuto: false,       // Fix Map
                    scrollbarPadding: false  // Fix Map
                });
            }
        }
    });
};

async function fetchFacilities(params = {}) {
    try {
        const url = new URL(apiBase + '/facilities');
        Object.keys(params).forEach(k => params[k] ? url.searchParams.append(k, params[k]) : null);
        const res = await fetch(url);
        const json = await res.json();
        return json.data || [];
    } catch (err) { return []; }
}

function showResults(list) {
    markersLayer.clearLayers();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (list.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align:center; color:#666;">Tidak ada lokasi ditemukan.</p>';
        return;
    }

    list.forEach(item => {
        const marker = L.marker([item.latitude, item.longitude]).addTo(markersLayer);
        
        marker.bindPopup(`
            <div style="text-align:center; min-width:160px;">
                <b>${item.name}</b><br/>
                <span style="font-size:12px; color:#666">${item.category}</span><br/>
                <small>${item.address || ''}</small>
                <hr style="margin:5px 0; border:0; border-top:1px solid #eee;">
                <div style="display:flex; gap:5px; justify-content:center;">
                    <button class="btn-edit-popup" onclick="startEdit(${item.id})">✏️Edit</button>
                    <button class="btn-delete-popup" onclick="deleteFacility(${item.id})">🗑️Hapus</button>
                </div>
            </div>
        `);
        
        marker.on('click', () => map.setView([item.latitude, item.longitude], 16));

        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <div style="float:right">
                <button class="btn-delete-small" onclick="event.stopPropagation(); deleteFacility(${item.id})" title="Hapus">🗑️</button>
                <button class="btn-edit-small" onclick="event.stopPropagation(); startEdit(${item.id})" title="Edit">✏️</button>
            </div>
            <b>${item.name}</b> 
            <span style="font-size:12px; background:#eee; padding:2px 5px; border-radius:4px;">${item.category}</span>
            <br/><small>${item.address || ''}</small>
        `;
        
        div.onclick = () => {
            map.setView([item.latitude, item.longitude], 16);
            marker.openPopup();
        };
        resultsDiv.appendChild(div);
    });
}

async function search() {
    const category = document.getElementById('filterCategory').value;
    const q = document.getElementById('q').value;
    const data = await fetchFacilities({ category: category || '', q: q || '' });
    showResults(data);
}

// Event Listeners
document.getElementById('searchBtn').addEventListener('click', search);
document.getElementById('q').addEventListener('keypress', (e) => { if (e.key === 'Enter') search(); });
document.getElementById('filterCategory').addEventListener('change', search);
document.getElementById('refreshBtn').addEventListener('click', () => {
    document.getElementById('q').value = '';
    document.getElementById('filterCategory').value = '';
    search();
});

window.onload = () => {
    search();
    // Safety check: Paksa map render ulang setelah load
    setTimeout(() => { map.invalidateSize(); }, 500);
};

// --- 4. LOGIC SUBMIT (DENGAN PERBAIKAN SWAL) ---
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const editId = document.getElementById('editId').value;
    const isEditMode = editId !== "";

    const payload = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        address: document.getElementById('addr').value,
        latitude: parseFloat(document.getElementById('lat').value),
        longitude: parseFloat(document.getElementById('lng').value),
        phone: document.getElementById('phone').value,
        description: document.getElementById('desc').value
    };
    
    const url = isEditMode ? `${apiBase}/facilities/${editId}` : `${apiBase}/facilities`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            Swal.fire({
                title: 'Berhasil!',
                text: isEditMode ? 'Data lokasi berhasil diupdate.' : 'Lokasi baru berhasil ditambahkan.',
                icon: 'success',
                confirmButtonColor: '#27ae60',
                // --- FIX MAP ILANG ---
                heightAuto: false,
                scrollbarPadding: false
                // ---------------------
            });

            resetFormState(); // Reset form
            search(); // Refresh map
        } else {
            Swal.fire({
                title: 'Oops...',
                text: 'Gagal menyimpan data.',
                icon: 'error',
                // --- FIX MAP ILANG ---
                heightAuto: false,
                scrollbarPadding: false
            });
        }
    } catch(err) {
        Swal.fire({
            title: 'Error',
            text: 'Masalah koneksi backend.',
            icon: 'error',
            // --- FIX MAP ILANG ---
            heightAuto: false,
            scrollbarPadding: false
        });
    }
});

// Klik Peta -> Isi Form
map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
    
    const details = document.querySelector('details');
    if(details && !details.open) details.setAttribute('open', true);
});