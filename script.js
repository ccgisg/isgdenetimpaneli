// Veri depolama için değişkenler
let workplaces = JSON.parse(localStorage.getItem('workplaces')) || [];
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let currentWorkplaceId = null;
let doctorSettings = JSON.parse(localStorage.getItem('doctorSettings')) || {};

// DOM Yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    // Login butonu event listener
    document.getElementById('loginBtn').addEventListener('click', login);
});

// Login fonksiyonu
function login() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    
    // Basit şifre kontrolü (varsayılan: 1234)
    if (password === '1234') {
        // Giriş başarılı
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('appContainer').classList.remove('d-none');
        
        // Uygulamayı başlat
        initApp();
    } else {
        // Giriş başarısız
        Swal.fire({
            icon: 'error',
            title: 'Hatalı Şifre',
            text: 'Lütfen geçerli bir şifre giriniz.',
            confirmButtonText: 'Tamam'
        });
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Logout fonksiyonu
function logout() {
    Swal.fire({
        title: 'Çıkış Yap',
        text: 'Uygulamadan çıkış yapmak istediğinize emin misiniz?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Evet, Çıkış Yap',
        cancelButtonText: 'İptal'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('appContainer').classList.add('d-none');
            document.getElementById('loginContainer').style.display = 'flex';
            document.getElementById('passwordInput').value = '';
        }
    });
}

// Uygulama başlatma
function initApp() {
    // İşyeri listesini güncelle
    updateWorkplaceList();
    
    // Çalışan tablosunu güncelle
    updateEmployeeTable();
    
    // Event listener'ları ekle
    document.getElementById('addWorkplaceBtn').addEventListener('click', () => openWorkplaceForm());
    document.getElementById('addEmployeeBtn').addEventListener('click', () => openEmployeeForm());
    document.getElementById('excelImportBtn').addEventListener('click', importFromExcel);
    document.getElementById('excelExportBtn').addEventListener('click', exportToExcel);
    document.getElementById('createEk2Btn').addEventListener('click', () => openEk2Form());
    document.getElementById('uploadEk2Btn').addEventListener('click', () => openEk2Upload());
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // İşyeri seçim event listener
    document.getElementById('workplaceSelect').addEventListener('change', function() {
        currentWorkplaceId = this.value ? parseInt(this.value) : null;
        updateWorkplaceInfo();
        updateEmployeeTable();
    });
    
    // Form kapatma butonları
    document.getElementById('closeWorkplaceForm').addEventListener('click', () => document.getElementById('workplaceFormModal').style.display = 'none');
    document.getElementById('closeEmployeeForm').addEventListener('click', () => document.getElementById('employeeFormModal').style.display = 'none');
    document.getElementById('closeEk2Create').addEventListener('click', () => document.getElementById('ek2CreateModal').style.display = 'none');
    document.getElementById('closeEk2Upload').addEventListener('click', () => document.getElementById('ek2UploadModal').style.display = 'none');
    document.getElementById('closeSettings').addEventListener('click', () => document.getElementById('settingsModal').style.display = 'none');
    
    // Form iptal butonları
    document.getElementById('cancelWorkplaceForm').addEventListener('click', () => document.getElementById('workplaceFormModal').style.display = 'none');
    document.getElementById('cancelEmployeeForm').addEventListener('click', () => document.getElementById('employeeFormModal').style.display = 'none');
    document.getElementById('cancelEk2Form').addEventListener('click', () => document.getElementById('ek2CreateModal').style.display = 'none');
    document.getElementById('cancelEk2Upload').addEventListener('click', () => document.getElementById('ek2UploadModal').style.display = 'none');
    document.getElementById('cancelSettings').addEventListener('click', () => document.getElementById('settingsModal').style.display = 'none');
    
    // Form submit işlemleri
    document.getElementById('workplaceForm').addEventListener('submit', saveWorkplace);
    document.getElementById('employeeForm').addEventListener('submit', saveEmployee);
    document.getElementById('saveEk2Upload').addEventListener('click', saveUploadedFiles);
    document.getElementById('printEk2Form').addEventListener('click', printEk2Form);
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    
    // Dışarı tıklayınca modalları kapat
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('workplaceFormModal')) document.getElementById('workplaceFormModal').style.display = 'none';
        if (e.target === document.getElementById('employeeFormModal')) document.getElementById('employeeFormModal').style.display = 'none';
        if (e.target === document.getElementById('ek2CreateModal')) document.getElementById('ek2CreateModal').style.display = 'none';
        if (e.target === document.getElementById('ek2UploadModal')) document.getElementById('ek2UploadModal').style.display = 'none';
        if (e.target === document.getElementById('settingsModal')) document.getElementById('settingsModal').style.display = 'none';
    });
}

// İşyeri listesini güncelleme
function updateWorkplaceList() {
    const select = document.getElementById('workplaceSelect');
    select.innerHTML = '<option value="">Lütfen seçim yapın</option>';
    
    workplaces.forEach(workplace => {
        const option = document.createElement('option');
        option.value = workplace.id;
        option.textContent = workplace.title;
        select.appendChild(option);
    });
    
    // Çalışan formundaki işyeri seçimini güncelle
    const employeeWorkplaceSelect = document.getElementById('employeeWorkplace');
    employeeWorkplaceSelect.innerHTML = '<option value="">Seçiniz</option>';
    workplaces.forEach(workplace => {
        const option = document.createElement('option');
        option.value = workplace.id;
        option.textContent = workplace.title;
        employeeWorkplaceSelect.appendChild(option);
    });
}

// İşyeri bilgilerini güncelleme
function updateWorkplaceInfo() {
    const infoContainer = document.getElementById('workplaceInfo');
    const title = document.getElementById('selectedWorkplaceTitle');
    const sgk = document.getElementById('selectedWorkplaceSgk');
    const address = document.getElementById('selectedWorkplaceAddress');
    const phone = document.getElementById('selectedWorkplacePhone');
    const email = document.getElementById('selectedWorkplaceEmail');
    
    if (currentWorkplaceId) {
        const workplace = workplaces.find(w => w.id === currentWorkplaceId);
        
        if (workplace) {
            title.textContent = workplace.title;
            sgk.textContent = workplace.sgk || '-';
            address.textContent = workplace.address || '-';
            phone.textContent = workplace.phone || '-';
            email.textContent = workplace.email || '-';
            infoContainer.classList.remove('d-none');
            return;
        }
    }
    
    infoContainer.classList.add('d-none');
}

// Çalışan tablosunu güncelleme
function updateEmployeeTable() {
    const tableBody = document.getElementById('employeeTable');
    tableBody.innerHTML = '';
    
    const filteredEmployees = currentWorkplaceId 
        ? employees.filter(e => e.workplaceId === currentWorkplaceId)
        : [];
    
    filteredEmployees.forEach(employee => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.tc}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>${employee.startDate}</td>
            <td>${employee.firstExamDate || '-'}</td>
            <td>${employee.lastExamDate || '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-employee" data-id="${employee.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-employee" data-id="${employee.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Edit ve delete butonları için event listener ekle
    document.querySelectorAll('.edit-employee').forEach(btn => {
        btn.addEventListener('click', function() {
            const employeeId = parseInt(this.getAttribute('data-id'));
            openEmployeeForm(employeeId);
        });
    });
    
    document.querySelectorAll('.delete-employee').forEach(btn => {
        btn.addEventListener('click', function() {
            const employeeId = parseInt(this.getAttribute('data-id'));
            deleteEmployee(employeeId);
        });
    });
}

// İşyeri formunu açma
function openWorkplaceForm(id = null) {
    const form = document.getElementById('workplaceForm');
    form.reset();
    
    if (id) {
        const workplace = workplaces.find(w => w.id === id);
        if (workplace) {
            document.getElementById('workplaceId').value = workplace.id;
            document.getElementById('workplaceTitle').value = workplace.title;
            document.getElementById('workplaceSgk').value = workplace.sgk;
            document.getElementById('workplaceAddress').value = workplace.address;
            document.getElementById('workplacePhone').value = workplace.phone;
            document.getElementById('workplaceEmail').value = workplace.email;
        }
    } else {
        document.getElementById('workplaceId').value = '';
    }
    
    document.getElementById('workplaceFormModal').style.display = 'block';
}

// Çalışan formunu açma
function openEmployeeForm(id = null) {
    const form = document.getElementById('employeeForm');
    form.reset();
    
    if (id) {
        const employee = employees.find(e => e.id === id);
        if (employee) {
            document.getElementById('employeeId').value = employee.id;
            document.getElementById('employeeName').value = employee.name;
            document.getElementById('employeeTc').value = employee.tc;
            document.getElementById('employeeWorkplace').value = employee.workplaceId;
            document.getElementById('employeeDepartment').value = employee.department;
            document.getElementById('employeePosition').value = employee.position;
            document.getElementById('employeeStartDate').value = employee.startDate;
            document.getElementById('firstExamDate').value = employee.firstExamDate || '';
            document.getElementById('lastExamDate').value = employee.lastExamDate || '';
        }
    } else {
        document.getElementById('employeeId').value = '';
    }
    
    document.getElementById('employeeFormModal').style.display = 'block';
}

// Ek-2 formunu açma
function openEk2Form() {
    const select = document.getElementById('ek2EmployeeSelect');
    select.innerHTML = '<option value="">Seçiniz</option>';
    
    employees.forEach(employee => {
        if (employee.workplaceId === currentWorkplaceId) {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.name;
            select.appendChild(option);
        }
    });
    
    document.getElementById('ek2CreateModal').style.display = 'block';
}

// Ek-2 yükleme formunu açma
function openEk2Upload() {
    document.getElementById('ek2UploadModal').style.display = 'block';
}

// Ayarları açma
function openSettings() {
    document.getElementById('doctorName').value = doctorSettings.name || '';
    document.getElementById('doctorTitle').value = doctorSettings.title || '';
    document.getElementById('diplomaDate').value = doctorSettings.diplomaDate || '';
    document.getElementById('diplomaNo').value = doctorSettings.diplomaNo || '';
    document.getElementById('certificateDate').value = doctorSettings.certificateDate || '';
    document.getElementById('certificateNo').value = doctorSettings.certificateNo || '';
    document.getElementById('settingsModal').style.display = 'block';
}

// İşyeri kaydet
function saveWorkplace(e) {
    e.preventDefault();
    const id = document.getElementById('workplaceId').value;
    const title = document.getElementById('workplaceTitle').value;
    const sgk = document.getElementById('workplaceSgk').value;
    const address = document.getElementById('workplaceAddress').value;
    const phone = document.getElementById('workplacePhone').value;
    const email = document.getElementById('workplaceEmail').value;
    
    if (!title || !sgk) {
        Swal.fire('Uyarı!', 'Lütfen zorunlu alanları doldurun.', 'warning');
        return;
    }
    
    if (id) {
        // Düzenleme
        const index = workplaces.findIndex(w => w.id === parseInt(id));
        if (index !== -1) {
            workplaces[index] = {
                ...workplaces[index],
                title,
                sgk,
                address,
                phone,
                email
            };
        }
    } else {
        // Yeni ekleme
        const newId = workplaces.length > 0 ? Math.max(...workplaces.map(w => w.id)) + 1 : 1;
        workplaces.push({
            id: newId,
            title,
            sgk,
            address,
            phone,
            email
        });
        
        if (!currentWorkplaceId) {
            currentWorkplaceId = newId;
            document.getElementById('workplaceSelect').value = newId;
        }
    }
    
    localStorage.setItem('workplaces', JSON.stringify(workplaces));
    updateWorkplaceList();
    updateWorkplaceInfo();
    document.getElementById('workplaceFormModal').style.display = 'none';
    Swal.fire('Başarılı!', 'İşyeri bilgileri kaydedildi.', 'success');
}

// Çalışan kaydet
function saveEmployee(e) {
    e.preventDefault();
    const id = document.getElementById('employeeId').value;
    const name = document.getElementById('employeeName').value;
    const tc = document.getElementById('employeeTc').value;
    const workplaceId = parseInt(document.getElementById('employeeWorkplace').value);
    const department = document.getElementById('employeeDepartment').value;
    const position = document.getElementById('employeePosition').value;
    const startDate = document.getElementById('employeeStartDate').value;
    const firstExamDate = document.getElementById('firstExamDate').value;
    const lastExamDate = document.getElementById('lastExamDate').value;
    
    if (!name || !tc || !workplaceId || !startDate) {
        Swal.fire('Uyarı!', 'Lütfen zorunlu alanları doldurun.', 'warning');
        return;
    }
    
    if (id) {
        // Düzenleme
        const index = employees.findIndex(e => e.id === parseInt(id));
        if (index !== -1) {
            employees[index] = {
                ...employees[index],
                name,
                tc,
                workplaceId,
                department,
                position,
                startDate,
                firstExamDate: firstExamDate || null,
                lastExamDate: lastExamDate || null
            };
        }
    } else {
        // Yeni ekleme
        const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
        employees.push({
            id: newId,
            name,
            tc,
            workplaceId,
            department,
            position,
            startDate,
            firstExamDate: firstExamDate || null,
            lastExamDate: lastExamDate || null
        });
    }
    
    localStorage.setItem('employees', JSON.stringify(employees));
    updateEmployeeTable();
    document.getElementById('employeeFormModal').style.display = 'none';
    Swal.fire('Başarılı!', 'Çalışan bilgileri kaydedildi.', 'success');
}

// Çalışan sil
function deleteEmployee(id) {
    Swal.fire({
        title: 'Emin misiniz?',
        text: "Bu çalışanı silmek istediğinize emin misiniz?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal'
    }).then((result) => {
        if (result.isConfirmed) {
            employees = employees.filter(e => e.id !== id);
            localStorage.setItem('employees', JSON.stringify(employees));
            updateEmployeeTable();
            Swal.fire('Silindi!', 'Çalışan başarıyla silindi.', 'success');
        }
    });
}

// Ayarları kaydet
function saveSettings() {
    doctorSettings = {
        name: document.getElementById('doctorName').value,
        title: document.getElementById('doctorTitle').value,
        diplomaDate: document.getElementById('diplomaDate').value,
        diplomaNo: document.getElementById('diplomaNo').value,
        certificateDate: document.getElementById('certificateDate').value,
        certificateNo: document.getElementById('certificateNo').value
    };
    
    localStorage.setItem('doctorSettings', JSON.stringify(doctorSettings));
    document.getElementById('settingsModal').style.display = 'none';
    Swal.fire('Başarılı!', 'Doktor ayarları kaydedildi.', 'success');
}

// Yüklenen dosyaları kaydet
function saveUploadedFiles() {
    const fileInput = document.getElementById('ek2FileInput');
    if (fileInput.files.length > 0) {
        Swal.fire('Başarılı!', 'Ek-2 formu başarıyla yüklendi.', 'success');
        document.getElementById('ek2UploadModal').style.display = 'none';
    } else {
        Swal.fire('Hata!', 'Lütfen bir dosya seçin.', 'error');
    }
}

// Ek-2 formunu yazdır
function printEk2Form() {
    const employeeId = parseInt(document.getElementById('ek2EmployeeSelect').value);
    const examDate = document.getElementById('ek2ExamDate').value;
    const examType = document.getElementById('ek2ExamType').value;
    
    if (!employeeId || !examDate) {
        Swal.fire('Uyarı!', 'Lütfen tüm alanları doldurun.', 'warning');
        return;
    }
    
    const employee = employees.find(e => e.id === employeeId);
    const workplace = workplaces.find(w => w.id === employee.workplaceId);
    
    if (employee && workplace) {
        // PDF oluşturma işlemleri buraya gelecek
        Swal.fire('Başarılı!', 'Ek-2 formu oluşturuldu.', 'success');
        document.getElementById('ek2CreateModal').style.display = 'none';
    } else {
        Swal.fire('Hata!', 'Çalışan veya işyeri bilgileri bulunamadı.', 'error');
    }
}

// Excel'den içe aktarma
function importFromExcel() {
    // Excel import işlemleri buraya gelecek
    Swal.fire('Bilgi', 'Excel içe aktarma işlemi henüz tamamlanmadı.', 'info');
}

// Excel'e dışa aktarma
function exportToExcel() {
    if (employees.length === 0) {
        Swal.fire('Uyarı!', 'Dışa aktarılacak veri bulunamadı.', 'warning');
        return;
    }
    
    // Sadece mevcut işyerinin çalışanlarını filtrele
    const data = employees.filter(e => e.workplaceId === currentWorkplaceId).map(emp => ({
        'Ad Soyad': emp.name,
        'TC Kimlik No': emp.tc,
        'Departman': emp.department,
        'Pozisyon': emp.position,
        'İşe Giriş Tarihi': emp.startDate,
        'İlk Muayene': emp.firstExamDate || '',
        'Son Muayene': emp.lastExamDate || ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Çalışanlar');
    XLSX.writeFile(workbook, 'calisanlar.xlsx');
}
