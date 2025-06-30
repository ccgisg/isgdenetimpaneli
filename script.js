document.addEventListener("DOMContentLoaded", function() {
    // DOM Elementleri
    const addWorkplaceBtn = document.getElementById("addWorkplace");
    const workplaceForm = document.getElementById("workplaceForm");
    const saveWorkplaceBtn = document.getElementById("saveWorkplace");
    const cancelWorkplaceBtn = document.getElementById("cancelWorkplace");
    const workplaceNameInput = document.getElementById("workplaceName");
    const workplaceCodeInput = document.getElementById("workplaceCode");
    const workplaceList = document.getElementById("workplaceList");

    const addEmployeeBtn = document.getElementById("addEmployee");
    const employeeForm = document.getElementById("employeeForm");
    const saveEmployeeBtn = document.getElementById("saveEmployee");
    const cancelEmployeeBtn = document.getElementById("cancelEmployee");
    const employeeNameInput = document.getElementById("employeeName");
    const employeeSurnameInput = document.getElementById("employeeSurname");
    const employeeTcknInput = document.getElementById("employeeTckn");
    const employeeDepartmentInput = document.getElementById("employeeDepartment");
    const employeePositionInput = document.getElementById("employeePosition");
    const employeeList = document.getElementById("employeeList");

    const employeeDetailsSection = document.getElementById("employeeDetails");
    const detailsContent = document.getElementById("detailsContent");

    // LocalStorage'dan verileri yükle
    let workplaces = JSON.parse(localStorage.getItem("workplaces")) || [];
    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    // İşyeri Ekleme
    addWorkplaceBtn.addEventListener("click", () => workplaceForm.style.display = "block");
    cancelWorkplaceBtn.addEventListener("click", resetWorkplaceForm);
    saveWorkplaceBtn.addEventListener("click", saveWorkplace);

    // Çalışan Ekleme
    addEmployeeBtn.addEventListener("click", () => employeeForm.style.display = "block");
    cancelEmployeeBtn.addEventListener("click", resetEmployeeForm);
    saveEmployeeBtn.addEventListener("click", saveEmployee);

    // Sayfa yüklendiğinde listeleri renderla
    renderWorkplaces();
    renderEmployees();

    // İşyeri Kaydetme Fonksiyonu
    function saveWorkplace() {
        const name = workplaceNameInput.value.trim();
        const code = workplaceCodeInput.value.trim();
        
        if (!name || !code) {
            alert("İşyeri adı ve kodu zorunludur!");
            return;
        }

        workplaces.push({ name, code });
        localStorage.setItem("workplaces", JSON.stringify(workplaces));
        renderWorkplaces();
        resetWorkplaceForm();
    }

    // Çalışan Kaydetme Fonksiyonu
    function saveEmployee() {
        const name = employeeNameInput.value.trim();
        const surname = employeeSurnameInput.value.trim();
        const tckn = employeeTcknInput.value.trim();
        const department = employeeDepartmentInput.value.trim();
        const position = employeePositionInput.value.trim();

        if (!name || !surname || !tckn || tckn.length !== 11) {
            alert("Ad, soyad ve 11 haneli TCKN zorunludur!");
            return;
        }

        employees.push({ name, surname, tckn, department, position });
        localStorage.setItem("employees", JSON.stringify(employees));
        renderEmployees();
        resetEmployeeForm();
    }

    // İşyerlerini Listeleme
    function renderWorkplaces() {
        workplaceList.innerHTML = workplaces.map((wp, index) => `
            <div class="item">
                <strong>${wp.name}</strong> (Kod: ${wp.code})
                <button onclick="editWorkplace(${index})">Düzenle</button>
                <button onclick="deleteWorkplace(${index})">Sil</button>
            </div>
        `).join("");
    }

    // Çalışanları Listeleme
    function renderEmployees() {
        employeeList.innerHTML = employees.map((emp, index) => `
            <div class="item" onclick="showEmployeeDetails(${index})">
                ${emp.name} ${emp.surname} (TCKN: ${emp.tckn})
                <button onclick="editEmployee(${index}); event.stopPropagation()">Düzenle</button>
                <button onclick="deleteEmployee(${index}); event.stopPropagation()">Sil</button>
            </div>
        `).join("");
    }

    // Çalışan Detaylarını Gösterme
    window.showEmployeeDetails = function(index) {
        const emp = employees[index];
        detailsContent.innerHTML = `
            <h3>Kişisel Bilgiler</h3>
            <p><strong>Ad Soyad:</strong> ${emp.name} ${emp.surname}</p>
            <p><strong>TCKN:</strong> ${emp.tckn}</p>
            <p><strong>Departman:</strong> ${emp.department || "-"}</p>
            <p><strong>Pozisyon:</strong> ${emp.position || "-"}</p>
        `;
        employeeDetailsSection.style.display = "block";
    };

    // Formları Sıfırlama
    function resetWorkplaceForm() {
        workplaceForm.style.display = "none";
        workplaceNameInput.value = "";
        workplaceCodeInput.value = "";
    }

    function resetEmployeeForm() {
        employeeForm.style.display = "none";
        employeeNameInput.value = "";
        employeeSurnameInput.value = "";
        employeeTcknInput.value = "";
        employeeDepartmentInput.value = "";
        employeePositionInput.value = "";
    }

    // Düzenleme/Silme Fonksiyonları (Global scope'a ekleniyor)
    window.editWorkplace = function(index) {
        const wp = workplaces[index];
        workplaceNameInput.value = wp.name;
        workplaceCodeInput.value = wp.code;
        workplaceForm.style.display = "block";
        
        saveWorkplaceBtn.onclick = function() {
            workplaces[index] = { name: workplaceNameInput.value.trim(), code: workplaceCodeInput.value.trim() };
            localStorage.setItem("workplaces", JSON.stringify(workplaces));
            renderWorkplaces();
            resetWorkplaceForm();
            saveWorkplaceBtn.onclick = saveWorkplace; // Orijinal fonksiyona geri dön
        };
    };

    window.deleteWorkplace = function(index) {
        if (confirm("Bu işyerini silmek istediğinize emin misiniz?")) {
            workplaces.splice(index, 1);
            localStorage.setItem("workplaces", JSON.stringify(workplaces));
            renderWorkplaces();
        }
    };

    window.editEmployee = function(index) {
        const emp = employees[index];
        employeeNameInput.value = emp.name;
        employeeSurnameInput.value = emp.surname;
        employeeTcknInput.value = emp.tckn;
        employeeDepartmentInput.value = emp.department || "";
        employeePositionInput.value = emp.position || "";
        employeeForm.style.display = "block";
        
        saveEmployeeBtn.onclick = function() {
            employees[index] = {
                name: employeeNameInput.value.trim(),
                surname: employeeSurnameInput.value.trim(),
                tckn: employeeTcknInput.value.trim(),
                department: employeeDepartmentInput.value.trim(),
                position: employeePositionInput.value.trim()
            };
            localStorage.setItem("employees", JSON.stringify(employees));
            renderEmployees();
            resetEmployeeForm();
            saveEmployeeBtn.onclick =
