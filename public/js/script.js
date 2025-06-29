const categoryForm = document.getElementById("categoryForm");
const productForm = document.getElementById("productForm");
const baseURL = "http://localhost:3000/api";

// CATEGORY FORM SUBMIT
if (categoryForm) {
    categoryForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = new FormData(categoryForm);
        const data = {
            name: form.get("name"),
            description: form.get("description"),
            image: form.get("image"),
            status: form.get("status") === "on"
        };

        const res = await fetch(`${baseURL}/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message || "Category added");
        if (res.ok) categoryForm.reset();
    });
}

// PRODUCT FORM SUBMIT
if (productForm) {
    // Fetch categories
    fetch(`${baseURL}/categories`)
        .then(res => res.json())
        .then(categories => {
            const select = document.getElementById("categorySelect");
            categories.forEach(cat => {
                const opt = document.createElement("option");
                opt.value = cat._id;
                opt.innerText = cat.name;
                select.appendChild(opt);
            });
        });

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = new FormData(productForm);
        const data = {
            name: form.get("name"),
            description: form.get("description"),
            originalPrice: +form.get("originalPrice"),
            sellingPrice: +form.get("sellingPrice"),
            stock: +form.get("stock"),
            category: form.get("category"),
            images: form.get("images").split(",").map(img => img.trim()),
            isFeatured: form.get("isFeatured") === "on",
            status: form.get("status") === "on"
        };

        const res = await fetch(`${baseURL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message || "Product added");
        if (res.ok) productForm.reset();
    });
}
