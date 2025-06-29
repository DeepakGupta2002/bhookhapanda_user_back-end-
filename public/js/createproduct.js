
const productForm = document.getElementById("productForm");
const baseURL = "http://localhost:5000/api";
let imageModal = null;
let selectedImages = [];
let allImages = [];
let activeCategory = "all";

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize image modal
    imageModal = new bootstrap.Modal(document.getElementById('imageModal'));

    // Initialize image selector button
    document.querySelector('.image-selector-btn').addEventListener('click', function () {
        fetchImages();
        imageModal.show();
    });

    // Initialize confirm selection button
    document.getElementById('confirmSelection').addEventListener('click', function () {
        updateImageInputAndPreview();
        imageModal.hide();
    });

    // Initialize upload button
    document.getElementById('uploadImageBtn').addEventListener('click', function () {
        // In a real app, this would open an upload modal or page
        Swal.fire({
            title: 'Upload Image',
            text: 'This would open the image upload interface in a complete implementation',
            icon: 'info'
        });
    });

    // Load categories
    fetchCategories();

    // Initialize form submission
    if (productForm) {
        productForm.addEventListener("submit", handleProductSubmit);
    }
});

// Fetch categories for dropdown
function fetchCategories() {
    fetch(`${baseURL}/categories`)
        .then(res => res.json())
        .then(categories => {
            const select = document.getElementById("categorySelect");
            select.innerHTML = '<option value="">Select a category</option>';
            categories.forEach(cat => {
                const opt = document.createElement("option");
                opt.value = cat._id;
                opt.innerText = cat.name;
                select.appendChild(opt);
            });
        });
}

// Fetch images from API
function fetchImages() {
    showLoading(true);

    fetch(`${baseURL}/images`)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch images');
            return res.json();
        })
        .then(images => {
            allImages = images;
            filterAndRenderImages(activeCategory);
            setupImageSearch();
        })
        .catch(err => {
            console.error("Error fetching images:", err);
            Swal.fire('Error', 'Failed to load images', 'error');
            document.getElementById('imageGrid').innerHTML = `
                        <div class="col-12 text-center py-5 text-danger">
                            <p class="mt-2">Failed to load images. Please try again.</p>
                        </div>
                    `;
        })
        .finally(() => {
            showLoading(false);
        });
}

// Filter and render images by category
function filterAndRenderImages(category) {
    activeCategory = category;

    // Update active button state
    document.querySelectorAll('#categoryButtons button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim().toLowerCase() === category.toLowerCase() ||
            (category === 'all' && btn.textContent.trim().toLowerCase() === 'all')) {
            btn.classList.add('active');
        }
    });

    const imagesToShow = category === "all"
        ? allImages
        : allImages.filter(img => img.type === category);

    renderImageGrid(imagesToShow);
}

// Render image grid
function renderImageGrid(images) {
    const imageGrid = document.getElementById('imageGrid');

    if (images.length === 0) {
        imageGrid.innerHTML = `
                    <div class="col-12 text-center py-5 text-muted">
                        <p>No images found in this category</p>
                    </div>
                `;
        return;
    }

    imageGrid.innerHTML = images.map(img => `
                <div class="col-md-3 mb-4">
                    <div class="image-card ${selectedImages.includes(img.url) ? 'selected' : ''}" 
                         onclick="toggleImageSelection('${img.url}')">
                        <img src="${img.url}" alt="${img.public_id}" />
                        <div class="image-info">
                            <div class="image-name">${img.public_id.split('/').pop()}</div>
                            <div>
                                <span class="badge badge-type badge-${img.type}">
                                    ${img.type}
                                </span>
                            </div>
                        </div>
                        <div class="select-btn">
                            ${selectedImages.includes(img.url) ? '✓' : '+'}
                        </div>
                    </div>
                </div>
            `).join("");
}

// Toggle image selection
function toggleImageSelection(url) {
    const index = selectedImages.indexOf(url);
    if (index === -1) {
        selectedImages.push(url);
    } else {
        selectedImages.splice(index, 1);
    }
    renderImageGrid(activeCategory === "all" ? allImages : allImages.filter(img => img.type === activeCategory));
}

// Update image input and preview
function updateImageInputAndPreview() {
    const input = document.getElementById('productImagesInput');
    const previewContainer = document.getElementById('imagePreviewContainer');

    input.value = selectedImages.join(', ');

    previewContainer.innerHTML = selectedImages.map(url => `
                <div class="image-preview-item">
                    <img src="${url}" alt="Preview">
                    <div class="remove-btn" onclick="removeImageFromSelection('${url}')">×</div>
                </div>
            `).join('');
}

// Remove image from selection
function removeImageFromSelection(url) {
    selectedImages = selectedImages.filter(imgUrl => imgUrl !== url);
    updateImageInputAndPreview();

    // Also update the selection in the modal if it's open
    if (document.querySelector('.image-card.selected')) {
        const cards = document.querySelectorAll('.image-card');
        cards.forEach(card => {
            if (card.querySelector('img').src === url) {
                card.classList.remove('selected');
                card.querySelector('.select-btn').innerHTML = '+';
            }
        });
    }
}

// Setup image search functionality
function setupImageSearch() {
    const searchBox = document.getElementById('imageSearch');
    searchBox.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.image-card');

        cards.forEach(card => {
            const name = card.querySelector('.image-name').textContent.toLowerCase();
            card.parentElement.style.display = name.includes(term) ? 'block' : 'none';
        });
    });
}

// Show/hide loading spinner
function showLoading(show) {
    const spinner = document.getElementById('spinnerContainer');
    if (show) {
        spinner.classList.add('show');
    } else {
        spinner.classList.remove('show');
    }
}

// Handle product form submission
async function handleProductSubmit(e) {
    e.preventDefault();

    // Validate form
    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput.value.length < 3) {
        Swal.fire('Error', 'Product name must be at least 3 characters', 'error');
        nameInput.focus();
        return;
    }

    if (selectedImages.length === 0) {
        Swal.fire('Error', 'Please select at least one image', 'error');
        return;
    }

    const categorySelect = document.getElementById('categorySelect');
    if (!categorySelect.value) {
        Swal.fire('Error', 'Please select a category', 'error');
        categorySelect.focus();
        return;
    }

    // Confirm submission
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You're about to create a new product",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, create it!'
    });

    if (!result.isConfirmed) return;

    showLoading(true);

    // Prepare form data
    const form = new FormData(productForm);
    const data = {
        name: form.get("name"),
        description: form.get("description"),
        originalPrice: +form.get("originalPrice"),
        sellingPrice: +form.get("sellingPrice"),
        stock: +form.get("stock"),
        category: form.get("category"),
        images: selectedImages,
        isFeatured: form.get("isFeatured") === "on",
        status: form.get("status") === "on"
    };

    try {
        const res = await fetch(`${baseURL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            Swal.fire('Success', 'Product created successfully!', 'success');
            productForm.reset();
            selectedImages = [];
            updateImageInputAndPreview();
            categorySelect.value = "";
        } else {
            Swal.fire('Error', result.message || 'Failed to create product', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Network error occurred', 'error');
    } finally {
        showLoading(false);
    }
}