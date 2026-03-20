// script.js
$(document).ready(function() {
    // CSS Variables and Global Setup
    // Already in CSS

    // Dynamic Gallery Data (Bonus: From array simulating JSON)
    const galleryData = [
        { id: 1, title: 'Blood Rush', category: 'action', img: 'https://via.placeholder.com/300x200?text=Blood+Rush' },
        { id: 2, title: 'Shadow Quest', category: 'rpg', img: 'https://via.placeholder.com/300x200?text=Shadow+Quest' },
        { id: 3, title: 'Gunfire Elite', category: 'shooter', img: 'https://via.placeholder.com/300x200?text=Gunfire+Elite' },
        { id: 4, title: 'Epic Saga', category: 'rpg', img: 'https://via.placeholder.com/300x200?text=Epic+Saga' },
        { id: 5, title: 'Fury Storm', category: 'action', img: 'https://via.placeholder.com/300x200?text=Fury+Storm' }
    ];

    const productsData = [
        { id: 1, name: 'T-Shirt', price: '$25', desc: 'Official tee', img: 'https://via.placeholder.com/200x200?text=T-Shirt' },
        { id: 2, name: 'Mug', price: '$15', desc: 'Logo mug', img: 'https://via.placeholder.com/200x200?text=Mug' },
        { id: 3, name: 'Poster', price: '$10', desc: 'Game poster', img: 'https://via.placeholder.com/200x200?text=Poster' },
        { id: 4, name: 'V1 Plush', price: '$30', desc: 'V1 character plush', img: 'https://via.placeholder.com/200x200?text=V1+Plush' },
        { id: 5, name: 'V2 Plush', price: '$35', desc: 'V2 character plush', img: 'https://via.placeholder.com/200x200?text=V2+Plush' },
        { id: 6, name: 'Gabriel Plush', price: '$28', desc: 'Gabriel character plush', img: 'https://via.placeholder.com/200x200?text=Gabriel+Plush' }
    ];

    // Home Gallery
    if ($('#home-gallery').length) {
        populateGallery($('#home-gallery'), galleryData.slice(0, 3));
    }

    // Games Gallery with Filtering
    if ($('#games-gallery').length) {
        populateGallery($('#games-gallery'), galleryData);
        $('.filter-btn').on('click', function() {
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            const filter = $(this).data('filter');
            filterGallery(filter);
        });
    }

    // Merchandise Search
    if ($('#search-input').length) {
        populateProducts($('#products-container'), productsData);
        $('#search-input').on('keyup', function() {
            const query = $(this).val().toLowerCase();
            $('#products-container .product-item').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1);
            });
        });
    }

    // Jobs CRUD
    let jobsData = [
        { id: 1, title: 'Game Designer', desc: 'Design levels', salary: 80000 },
        { id: 2, title: 'Programmer', desc: 'Code features', salary: 90000 }
    ];
    if ($('#jobs-table').length) {
        populateJobsTable(jobsData);
        $('#job-search').on('keyup', function() {
            const query = $(this).val().toLowerCase();
            $('#jobs-table tbody tr').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1);
            });
        });
    }

    // Login Form Validation
    if ($('#login-form').length) {
        $('#username').on('blur', validateEmail);
        $('#password').on('input', function() {
            validatePassword(this.value);
            validateConfirm();
        });
        $('#confirm-password').on('input', validateConfirm);
        $('#login-form').on('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
            }
        });
    }

    // Lightbox for Gallery
    $('.gallery-item img').on('click', function() {
        openLightbox($(this).attr('src'));
    });

    $('.close, #lightbox').on('click', closeLightbox);
    $('#prev').on('click', prevImage);
    $('#next').on('click', nextImage);

    // Animations
    $('.gallery-item, .product-item').hide().fadeIn(1000);
});

// Helper Functions

// Populate Gallery
function populateGallery(container, data) {
    data.forEach(item => {
        const itemHtml = `
            <div class="gallery-item ${item.category}" data-category="${item.category}">
                <img src="${item.img}" alt="${item.title}" loading="lazy">
                <h3>${item.title}</h3>
            </div>
        `;
        container.append(itemHtml);
    });
    // Rebind lightbox
    $('.gallery-item img').off('click').on('click', function() {
        openLightbox($(this).attr('src'));
    });
}

// Filter Gallery
function filterGallery(category) {
    $('.gallery-item').fadeOut(300);
    setTimeout(() => {
        if (category === 'all') {
            $('.gallery-item').fadeIn(300);
        } else {
            $(`.gallery-item[data-category="${category}"]`).fadeIn(300);
        }
    }, 300);
}

// Populate Products
function populateProducts(container, data) {
    data.forEach(product => {
        const productHtml = `
            <div class="product-item">
                <img src="${product.img}" alt="${product.name}" loading="lazy">
                <h3>${product.name}</h3>
                <p>${product.price} - ${product.desc}</p>
            </div>
        `;
        container.append(productHtml);
    });
}

// Jobs Table
function populateJobsTable(data) {
    const tbody = $('#jobs-table tbody');
    tbody.empty();
    data.forEach(job => {
        const row = `
            <tr>
                <td>${job.id}</td>
                <td contenteditable="true" onblur="updateJob(${job.id}, 'title', this.innerText)">${job.title}</td>
                <td contenteditable="true" onblur="updateJob(${job.id}, 'desc', this.innerText)">${job.desc}</td>
                <td contenteditable="true" onblur="updateJob(${job.id}, 'salary', this.innerText)">$${job.salary}</td>
                <td>
                    <button onclick="editJob(${job.id})">Edit</button>
                    <button onclick="deleteJob(${job.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

function showAddModal() {
    $('#modal-title').text('Add Job');
    $('#job-form')[0].reset();
    $('#job-id').val('');
    new bootstrap.Modal(document.getElementById('job-modal')).show();
}

function saveJob() {
    const id = $('#job-id').val() || Date.now();
    const title = $('#job-title').val();
    const desc = $('#job-desc').val();
    const salary = $('#job-salary').val();
    if (!title || !desc || !salary) return alert('Fill all fields');

    const job = { id: parseInt(id), title, desc, salary: parseInt(salary) };
    const index = jobsData.findIndex(j => j.id == id);
    if (index > -1) {
        jobsData[index] = job;
    } else {
        jobsData.push(job);
    }
    populateJobsTable(jobsData);
    $('#job-modal').modal('hide');
    $('#job-form')[0].reset();
    $('.gallery-item').fadeIn(500); // Animation example
}

function editJob(id) {
    const job = jobsData.find(j => j.id == id);
    if (job) {
        $('#job-id').val(job.id);
        $('#job-title').val(job.title);
        $('#job-desc').val(job.desc);
        $('#job-salary').val(job.salary);
        $('#modal-title').text('Edit Job');
        new bootstrap.Modal(document.getElementById('job-modal')).show();
    }
}

function deleteJob(id) {
    if (confirm('Delete this job?')) {
        jobsData = jobsData.filter(j => j.id != id);
        populateJobsTable(jobsData);
        $('#jobs-table tbody tr').fadeOut(500).remove();
    }
}

function updateJob(id, field, value) {
    const job = jobsData.find(j => j.id == id);
    if (job) job[field] = value;
}

// Form Validation
function validateEmail() {
    const email = $('#username').val();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $('#username-error').text(email && !regex.test(email) ? 'Invalid email' : '');
}

function validatePassword(pass) {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;

    const indicator = $('#strength-indicator');
    indicator.removeClass('strength-weak strength-medium strength-strong')
        .addClass(strength <= 2 ? 'strength-weak' : strength <= 3 ? 'strength-medium' : 'strength-strong');
    $('#password-error').text(strength < 3 ? 'Password too weak' : '');
}

function validateConfirm() {
    const pass = $('#password').val();
    const confirm = $('#confirm-password').val();
    $('#confirm-error').text(confirm && confirm !== pass ? 'Passwords do not match' : '');
}

function validateForm() {
    validateEmail();
    validatePassword($('#password').val());
    validateConfirm();
    return !($('#username-error').text() || !$('#password-error').text() || !$('#confirm-error').text());
}

// Lightbox
let currentImgIndex = 0;
const allImages = [];

function openLightbox(src) {
    $('#lightbox').show();
    $('#lightbox-img').attr('src', src);
    allImages = $('.gallery-item img').map(function() { return $(this).attr('src'); }).get();
    currentImgIndex = allImages.indexOf(src);
}

function closeLightbox() {
    $('#lightbox').hide();
}

function prevImage() {
    currentImgIndex = (currentImgIndex - 1 + allImages.length) % allImages.length;
    $('#lightbox-img').attr('src', allImages[currentImgIndex]).fadeOut(200).fadeIn(200);
}

function nextImage() {
    currentImgIndex = (currentImgIndex + 1) % allImages.length;
    $('#lightbox-img').attr('src', allImages[currentImgIndex]).fadeOut(200).fadeIn(200);
}

// Modal Functions
function showModal(modalId) {
    new bootstrap.Modal(document.getElementById(modalId)).show();
}