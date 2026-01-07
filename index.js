// Get search elements
const searchInput = document.querySelector('#search input[type="search"]');
const searchButton = document.querySelector('#search .btn-outline-success');

// Define all product pages with their categories
const productPages = [
  { page: 'index.html', category: 'All Products' },
  { page: 'tablet.html', category: 'Tablet' },
  { page: 'camera.html', category: 'Cameras' },
  { page: 'speaker.html', category: 'Speaker' },
  { page: 'watch.html', category: 'Watch' },
  { page: 'Headphone.html', category: 'Headphone' },
  { page: 'laptop.html', category: 'Laptop' }
];

// Search function for current page
function searchCurrentPage() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  // Get all product cards from both #product-cards containers
  const productContainers = document.querySelectorAll('#product-cards');
  
  if (searchTerm === '') {
    // Show all products if search is empty and restore original order
    productContainers.forEach(container => {
      const rows = container.querySelectorAll('.row');
      rows.forEach(row => {
        const cols = row.querySelectorAll('.col-md-3, .col-md-4, .col-md-6');
        cols.forEach(col => {
          col.style.display = 'block';
          col.style.order = ''; // Reset order
        });
      });
    });
    return 0;
  }
  
  let foundCount = 0;
  let matchedProducts = [];
  let unmatchedProducts = [];
  
  // Loop through all product containers
  productContainers.forEach(container => {
    const rows = container.querySelectorAll('.row');
    
    rows.forEach(row => {
      const cols = row.querySelectorAll('.col-md-3, .col-md-4, .col-md-6');
      
      // Convert to array to sort
      const colsArray = Array.from(cols);
      
      colsArray.forEach(col => {
        const card = col.querySelector('.card');
        const cardBody = card?.querySelector('.card-body');
        const cardOverlay = card?.querySelector('.card-img-overlay');
        
        let productName = '';
        let productDesc = '';
        
        if (cardBody) {
          productName = cardBody.querySelector('h3')?.textContent.toLowerCase() || '';
          productDesc = cardBody.querySelector('p')?.textContent.toLowerCase() || '';
        } else if (cardOverlay) {
          productName = cardOverlay.querySelector('h3')?.textContent.toLowerCase() || '';
          productDesc = cardOverlay.querySelector('p')?.textContent.toLowerCase() || '';
        }
        
        // Check if search term matches product name or description
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
          col.style.display = 'block';
          matchedProducts.push(col);
          foundCount++;
        } else {
          col.style.display = 'none';
          unmatchedProducts.push(col);
        }
      });
      
      // Reorder products - matched first, then unmatched
      if (matchedProducts.length > 0) {
        // Make row flexbox to allow ordering
        row.style.display = 'flex';
        row.style.flexWrap = 'wrap';
        
        matchedProducts.forEach((col, index) => {
          col.style.order = index;
        });
        
        unmatchedProducts.forEach((col, index) => {
          col.style.order = matchedProducts.length + index;
        });
      }
    });
  });
  
  // Scroll to products section if found
  if (foundCount > 0) {
    const firstProductSection = document.querySelector('#product-cards');
    if (firstProductSection) {
      firstProductSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  return foundCount;
}

// Main search function
function searchProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    alert('Please enter a search term');
    return;
  }
  
  // Search in current page first
  const foundInCurrentPage = searchCurrentPage();
  
  if (foundInCurrentPage > 0) {
    console.log('Found ' + foundInCurrentPage + ' products matching: ' + searchTerm);
    
    // Show success message
    const firstProductSection = document.querySelector('#product-cards h1');
    if (firstProductSection) {
      const originalText = firstProductSection.textContent;
      firstProductSection.textContent = 'SEARCH RESULTS (' + foundInCurrentPage + ' found)';
      firstProductSection.style.color = '#28a745';
      
      // Reset after 3 seconds
      setTimeout(() => {
        firstProductSection.textContent = originalText;
        firstProductSection.style.color = '';
      }, 3000);
    }
  } else {
    // Check which category might have the product
    const categoryMatches = [];
    
    productPages.forEach(pageInfo => {
      if (pageInfo.category.toLowerCase().includes(searchTerm)) {
        categoryMatches.push(pageInfo);
      }
    });
    
    if (categoryMatches.length > 0) {
      // Redirect to the matching category page
      const confirmed = confirm(
        'No products found on this page.\n\n' +
        'Would you like to check the "' + categoryMatches[0].category + '" category?'
      );
      
      if (confirmed) {
        window.location.href = categoryMatches[0].page;
      } else {
        // Show all products again
        searchInput.value = '';
        searchCurrentPage();
      }
    } else {
      // Show suggestion to check other pages
      const message = 'No products found matching: "' + searchTerm + '"\n\n' +
                     'Try searching in these categories:\n' +
                     '• Tablet\n' +
                     '• Cameras\n' +
                     '• Speaker\n' +
                     '• Watch\n' +
                     '• Headphone\n' +
                     '• Laptop';
      
      alert(message);
      
      // Reset to show all products
      searchInput.value = '';
      searchCurrentPage();
    }
  }
}

// Add click event to search button
searchButton.addEventListener('click', function(e) {
  e.preventDefault();
  searchProducts();
});

// Add enter key event to search input
searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchProducts();
  }
});

// Clear search and show all products when input is cleared
searchInput.addEventListener('input', function() {
  if (searchInput.value.trim() === '') {
    const productContainers = document.querySelectorAll('#product-cards');
    productContainers.forEach(container => {
      const rows = container.querySelectorAll('.row');
      rows.forEach(row => {
        const cols = row.querySelectorAll('.col-md-3, .col-md-4, .col-md-6');
        cols.forEach(col => {
          col.style.display = 'block';
          col.style.order = ''; // Reset order
        });
        row.style.display = ''; // Reset display
        row.style.flexWrap = ''; // Reset flex
      });
    });
    
    // Reset heading
    const firstProductSection = document.querySelector('#product-cards h1');
    if (firstProductSection && firstProductSection.textContent.includes('SEARCH RESULTS')) {
      firstProductSection.textContent = 'PRODUCTS';
      firstProductSection.style.color = '';
    }
    
    // Also show other-cards sections
    const otherCards = document.querySelectorAll('#other-cards, #other');
    otherCards.forEach(section => {
      section.style.display = 'block';
    });
  }
});
// ============ ADD TO CART FUNCTIONALITY ============

// Function to add product to cart
function addToCart(card) {
  const cardBody = card.querySelector('.card-body');
  
  if (cardBody) {
    const productName = cardBody.querySelector('h3')?.textContent || 'Unknown Product';
    const productPrice = cardBody.querySelector('h2')?.textContent.split(' ')[0] || '$0';
    
    // Store product in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
      existingProduct.quantity += 1;
      alert(productName + ' quantity increased in cart!');
    } else {
      cart.push({
        name: productName,
        price: productPrice,
        quantity: 1,
        image: card.querySelector('img')?.src || ''
      });
      alert(productName + ' added to cart!');
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return true;
  }
  return false;
}

// Get all cart icons (fa-cart-shopping)
const cartIcons = document.querySelectorAll('.fa-cart-shopping');

// Add click event to each cart icon
cartIcons.forEach(icon => {
  icon.style.cursor = 'pointer'; // Change cursor to pointer
  
  icon.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Get product details
    const card = this.closest('.card');
    
    if (addToCart(card)) {
      // Add animation to icon
      this.style.transform = 'scale(1.3)';
      this.style.color = '#28a745';
      
      setTimeout(() => {
        this.style.transform = 'scale(1)';
        this.style.color = '';
      }, 300);
      
      // Redirect to cart page after short delay
      setTimeout(() => {
        window.location.href = 'cart-page.html';
      }, 800);
    }
  });
});

// Get all price spans (h2 span elements that contain cart icons)
const priceSpans = document.querySelectorAll('.card-body h2 span');

// Add click event to each span
priceSpans.forEach(span => {
  span.style.cursor = 'pointer'; // Change cursor to pointer
  
  span.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get product details
    const card = this.closest('.card');
    
    if (addToCart(card)) {
      // Add animation to span
      this.style.transform = 'scale(1.2)';
      this.style.backgroundColor = '#28a745';
      this.style.borderRadius = '5px';
      this.style.padding = '5px';
      
      setTimeout(() => {
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = '';
        this.style.borderRadius = '';
        this.style.padding = '';
      }, 300);
      
      // Redirect to cart page after short delay
      setTimeout(() => {
        window.location.href = 'cart-page.html';
      }, 800);
    }
  });
});