document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const form = document.getElementById("csvForm");
  const fileInput = document.getElementById("csvFile");
  const separatorInput = document.getElementById("separator");
  const message = document.getElementById("message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // clear previous messages and table
    message.textContent = "";
    message.className = "message";
    container.removeChild(container.lastChild);

    // validate file input
    const file = fileInput.files[0];
    if (!file) {
      showMessage("Please select a CSV file.", "error");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      showMessage("Please select a valid CSV file.", "error");
      return;
    }

    // validate separator input
    const separator = separatorInput.value.trim();
    if (separator.length !== 1) {
      showMessage("Please enter a single character as the separator.", "error");
      return;
    }

    // read and process the CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      const tableContainer = document.createElement("div");
      tableContainer.classList.add("table-container");

      const table = createTableFromCSV(csvData, separator);

      tableContainer.appendChild(table);
      container.appendChild(tableContainer);

      showMessage("File uploaded and processed successfully!", "success");
    };
    reader.onerror = () => {
      showMessage("Error reading the file.", "error");
    };
    reader.readAsText(file);
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
  }

  function createTableFromCSV(csvData, separator) {
    const rows = csvData.split("\n");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    rows.forEach((row, rowIndex) => {
      // skip empty rows
      if (row.trim() === "") return;

      const tr = document.createElement("tr");

      const cells = row.split(separator);

      cells.forEach((cell) => {
        const element = rowIndex === 0 ? "th" : "td";
        const cellElement = document.createElement(element);
        const isUrl = cell.trim().startsWith("https://");
        if (isUrl) {
          const anchor = document.createElement("a");
          anchor.textContent = cell.trim();
          anchor.setAttribute("href", cell.trim());
          anchor.setAttribute("target", "_blank");
          anchor.setAttribute("rel", "noopener noreferrer");
          cellElement.appendChild(anchor);
        } else {
          cellElement.textContent = cell.trim();
        }

        tr.appendChild(cellElement);
      });

      if (rowIndex === 0) {
        thead.appendChild(tr);
      } else {
        tbody.appendChild(tr);
      }
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }
});
