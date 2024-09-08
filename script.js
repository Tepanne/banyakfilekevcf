// Proses banyak file TXT ke VCF
document.getElementById('processFilesBtn').addEventListener('click', function() {
    const files = document.getElementById('file-input').files;
    const fileAreas = document.getElementById('file-areas');
    const startCategory = document.getElementById('startCategoryInput').value.trim().toLowerCase(); // Ambil kategori awal

    fileAreas.innerHTML = ''; // Kosongkan div sebelum menambahkan textarea baru

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const textArea = document.createElement('textarea');
            textArea.classList.add('small-textarea');
            textArea.value = e.target.result;

            // Input untuk memasukkan nama file VCF
            const fileNameInput = document.createElement('input');
            fileNameInput.type = 'text';
            fileNameInput.placeholder = 'Masukkan nama file VCF';
            fileNameInput.classList.add('file-name-input');

            // Input untuk memasukkan nama kontak
            const contactNameInput = document.createElement('input');
            contactNameInput.type = 'text';
            contactNameInput.placeholder = 'Masukkan nama kontak';
            contactNameInput.classList.add('contact-name-input');

            const fileNameLabel = document.createElement('label');
            fileNameLabel.textContent = `Nama File Asal: ${file.name}`;
            fileNameLabel.classList.add('file-name-label');

            const generateButton = document.createElement('button');
            generateButton.textContent = 'Generate VCF';
            generateButton.classList.add('generate-vcf-btn');
            generateButton.addEventListener('click', () => {
                const lines = textArea.value.split('\n').map(line => line.trim());
                const filename = fileNameInput.value.trim() || 'contacts';
                const contactName = contactNameInput.value.trim() || 'Contact';
                let vcfContent = '';
                let contactIndex = 1;
                let foundStartCategory = startCategory === ''; // Jika kategori kosong, mulai konversi langsung
                let validCategories = ['admin', 'navy', 'anggota']; // Kategori yang valid

                // Log untuk debugging
                console.log(`Mulai mencari dari kategori: ${startCategory || 'Semua kontak'}`);

                lines.forEach(line => {
                    const lowerLine = line.toLowerCase();

                    // Jika kategori diisi, mulai dari kategori yang dipilih
                    if (startCategory && lowerLine === startCategory) {
                        foundStartCategory = true; // Mulai konversi dari kategori yang dipilih
                        console.log(`Ditemukan kategori: ${startCategory}`);
                    } else if (startCategory && validCategories.includes(lowerLine)) {
                        foundStartCategory = false; // Berhenti jika menemukan kategori lain saat startCategory dipilih
                    }

                    // Jika tidak ada kategori (convert semua) atau sudah menemukan kategori yang diinginkan
                    if ((foundStartCategory || !startCategory) && line && !validCategories.includes(lowerLine)) {
                        let phoneNumber = line;
                        if (!phoneNumber.startsWith('+')) {
                            phoneNumber = '+' + phoneNumber;
                        }
                        vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName} ${contactIndex}\nTEL:${phoneNumber}\nEND:VCARD\n\n`;
                        contactIndex++;
                    }
                });

                if (vcfContent) {
                    const blob = new Blob([vcfContent], { type: 'text/vcard' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${filename}.vcf`;
                    a.textContent = `Download ${filename}.vcf`;
                    a.style.display = 'block';
                    a.click();
                    URL.revokeObjectURL(url);
                } else {
                    console.error('Tidak ada konten VCF yang digenerate.');
                    alert('Tidak ada kontak yang berhasil di-convert.');
                }
            });

            fileAreas.appendChild(fileNameLabel);
            fileAreas.appendChild(fileNameInput);
            fileAreas.appendChild(contactNameInput); // Tambahkan input untuk nama kontak
            fileAreas.appendChild(textArea);
            fileAreas.appendChild(generateButton);
        };
        reader.readAsText(file);
    });
});
