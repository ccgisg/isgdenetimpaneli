document.addEventListener("DOMContentLoaded", function() {
    // Örnek Veriler (LocalStorage ile değiştirilecek)
    let workplaces = [
        { name: "ABC Teknoloji A.Ş.", code: "505-123456789" },
        { name: "XYZ İnşaat Ltd.", code: "505-587454311" }
    ];

    let employees = [
        { name: "Ahmet", surname: "Yılmaz", tckn: "12345678901", department: "Üretim", position: "Teknisyen", workplace: "ABC Teknoloji A.Ş." },
        { name: "Ayşe", surname: "Kaya", tckn: "10987654321", department: "İnsan Kaynakları", position: "Uzman", workplace: "XYZ İnşaat Ltd." }
    ];

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
    const detailsContent = document.querySelector(".details-content");

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

    // İşyeri Kaydetme
    function saveWorkplace() {
        const name = workplaceNameInput.value.trim();
        const code = workplaceCodeInput.value.trim();
        
        if (!name || !code) {
            alert("İşyeri adı ve kodu zorunludur!");
            return;
        }

        workplaces.push({ name, code });
        renderWorkplaces();
        resetWorkplaceForm();
    }

    // Çalışan Kaydetme
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

        employees.push({ name, surname, tckn, department, position, workplace: workplaces[0]?.name || "" });
        renderEmployees();
        resetEmployeeForm();
    }

    // İşyerlerini Listele
    function renderWorkplaces() {
        workplaceList.innerHTML = workplaces.map(wp => `
            <div class="workplace-item">
                <h3>${wp.name}</h3>
                <p><strong>Kod:</strong> ${wp.code}</p>
                <div class="actions">
                    <button class="edit">Düzenle</button>
                    <button class="delete">Sil</button>
                </div>
            </div>
        `).join("");
    }

    // Çalışanları Listele
    function renderEmployees() {
        employeeList.innerHTML = employees.map(emp => `
            <div class="employee-item" onclick="showEmployeeDetails('${emp.tckn}')">
                <h3>${emp.name} ${emp.surname}</h3>
                <p><strong>TCKN:</strong> ${emp.tckn}</p>
                <div class="actions">
                    <button class="edit">Düzenle</button>
                    <button class="delete">Sil</button>
                </div>
            </div>
        `).join("");
    }

    // Çalışan Detaylarını Göster
    window.showEmployeeDetails = function(tckn) {
        const emp = employees.find(e => e.tckn === tckn);
        if (!emp) return;

        detailsContent.innerHTML = `
            <h3>Kişisel Bilgiler</h3>
            <p><strong>Ad Soyad:</strong> ${emp.name} ${emp.surname}</p>
            <p><strong>TCKN:</strong> ${emp.tckn}</p>
            <p><strong>Departman:</strong> ${emp.department || "-"}</p>
            <p><strong>Pozisyon:</strong> ${emp.position || "-"}</p>
            <h3>İş Bilgileri</h3>
            <p><strong>İşyeri:</strong> ${emp.workplace || "-"}</p>
        `;
        employeeDetailsSection.style.display = "block";
    };

    // Formları Sıfırla
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
});
