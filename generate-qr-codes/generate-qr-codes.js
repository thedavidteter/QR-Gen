document.getElementById("addArea").addEventListener("click", addArea);
document.getElementById("addSale").addEventListener("click", addSale);
document.getElementById("qrCodeForm").addEventListener("submit", generateQRCodes);

function addArea() {
  const areaInputs = document.getElementById("areaInputs");
  const newRow = document.createElement("div");
  newRow.classList.add("area-row");

  newRow.innerHTML = `
    <label>Name:</label>
    <input type="text" class="areaName" required>
    <label>Code:</label>
    <input type="text" class="locationCode" required>
    <button type="button" class="removeArea">- Remove Area</button>
  `;
  newRow.querySelector(".removeArea").addEventListener("click", () => newRow.remove());
  areaInputs.appendChild(newRow);
}

function addSale() {
  const saleInputs = document.getElementById("saleInputs");
  const newRow = document.createElement("div");
  newRow.classList.add("sale-row");

  newRow.innerHTML = `
    <label>Name:</label>
    <input type="text" class="saleName" required>
    <label>ID:</label>
    <input type="text" class="saleID" required>
    <button type="button" class="removeSale">- Remove Sale</button>
  `;
  newRow.querySelector(".removeSale").addEventListener("click", () => newRow.remove());
  saleInputs.appendChild(newRow);
}

function generateQRCodes(e) {
  e.preventDefault();
  
  const areaNames = Array.from(document.getElementsByClassName("areaName")).map(input => input.value.split(','));
  const locationCodes = Array.from(document.getElementsByClassName("locationCode")).map(input => input.value.split(','));
  const saleNames = Array.from(document.getElementsByClassName("saleName")).map(input => input.value.split(','));
  const saleIDs = Array.from(document.getElementsByClassName("saleID")).map(input => input.value.split(','));
  const lotsPerRoom = parseInt(document.getElementById("lotsPerRoom").value);

  const qrCodesContainer = document.getElementById("qrCodes");
  qrCodesContainer.innerHTML = '';

  saleIDs.flat().forEach((saleID, saleIndex) => {
    locationCodes.flat().forEach((locationCode, locationIndex) => {
      const locationContainer = document.createElement("div");
      locationContainer.classList.add("location-container");

      const locationHeader = document.createElement("h4");
      locationHeader.classList.add("location-header");
      locationHeader.textContent = `Area: ${areaNames.flat()[locationIndex]}, Sale: ${saleNames.flat()[saleIndex]}`;      locationContainer.appendChild(locationHeader);
      for (let i = 1; i <= lotsPerRoom; i++) {
        const sequenceCodeM = i.toString().padStart(3, '0')
        const metadata = {
          saleID,
          locationCode,
          sequenceCode: sequenceCodeM,
          itemID: `${locationCode}-${sequenceCodeM}-${saleNames.flat()[saleIndex]}`,
        };
        


        const qrCodeElement = document.createElement("div");
        qrCodeElement.classList.add("qrCode");
        generateQRCode(qrCodeElement, metadata);
        const label = document.createElement("p");
        label.textContent = `${locationCode}-${sequenceCodeM}-${saleNames.flat()[saleIndex]}`;
        qrCodeElement.appendChild(label);
        locationContainer.appendChild(qrCodeElement);

        qrCodesContainer.appendChild(locationContainer);
      }
    });
  });
}

function generateQRCode(element, metadata) {
  const qrCode = new QRCode(element, {
    text: JSON.stringify(metadata),
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}
