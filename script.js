document.addEventListener("DOMContentLoaded", function() {
    const addWorkplaceBtn = document.getElementById("addWorkplace");
    const workplaceForm = document.getElementById("workplaceForm");
    const saveWorkplaceBtn = document.getElementById("saveWorkplace");
    const cancelWorkplaceBtn = document.getElementById("cancelWorkplace");
    const workplaceNameInput = document.getElementById("workplaceName");
    const workplaceList = document.getElementById("workplaceList");

    const addEmployeeBtn = document.getElementById("addEmployee");
    const employeeForm = document.getElementById("employeeForm");
    const saveEmployeeBtn = document.getElementById("saveEmployee");
    const cancelEmployeeBtn = document.getElementById("cancelEmployee");
    const employeeNameInput = document.getElementById("employeeName");
    const employeeSurnameInput = document.getElementById("employeeSurname");
    const employeeTcknInput = document.getElementById("employeeTckn");
    const employeeList = document.getElementById("employeeList");

    let workplaces = [];
    let employees = [];

    addWorkplaceBtn.addEventListener("click", function() {
        workplaceForm.style.display = "block";
    });

    cancelWorkplaceBtn.addEventListener("click", function() {
        workplaceForm.style.display = "none";
        workplaceNameInput.value = "";
    });

    saveWorkplaceBtn.addEventListener("click", function() {
        const name = workplaceNameInput.value.trim();
        if (name) {
            workplaces.push(name);
            renderWorkplaces();
            workplaceForm.style.display = "none";
            workplaceNameInput.value = "";
        }
    });

    addEmployeeBtn.addEventListener("click", function() {
        employeeForm.style.display = "block";
    });

    cancelEmployeeBtn.addEventListener("click", function() {
        employeeForm.style.display = "none";
        employeeNameInput.value = "";
        employeeSurnameInput.value = "";
        employeeTcknInput.value = "";
    });

    saveEmployeeBtn.addEventListener("click", function() {
        const name = employeeNameInput.value.trim();
        const surname = employeeSurnameInput.value.trim();
        const tckn = employeeTcknInput.value.trim();
        if (name && surname && tckn) {
            employees.push({ name, surname, tckn });
            renderEmployees();
            employeeForm.style.display = "none";
            employeeNameInput.value = "";
            employeeSurnameInput.value = "";
            employeeTcknInput.value = "";
        }
    });

    function renderWorkplaces() {
        workplaceList.innerHTML = "";
        workplaces.forEach((workplace, index) => {
            const div = document.createElement("div");
            div.className = "item";
            div.textContent = `${index + 1}. ${workplace}`;
            workplaceList.appendChild(div);
        });
    }

    function renderEmployees() {
        employeeList.innerHTML = "";
        employees.forEach((employee, index) => {
            const div = document.createElement("div");
            div.className = "item";
            div.textContent = `${index + 1}. ${employee.name} ${employee.surname} (TCKN: ${employee.tckn})`;
            employeeList.appendChild(div);
        });
    }
});
