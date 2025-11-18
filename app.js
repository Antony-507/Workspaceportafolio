// Sistema de autenticación básico
const auth = {
    isAuthenticated: false,
    
    login(username, password) {
        // Autenticación para Antony
        if((username === 'Antony' && password === '507') || (username === 'admin' && password === 'admin123')) {
            this.isAuthenticated = true;
            // Guardar usuario en sessionStorage
            sessionStorage.setItem('usuario', username);
            return true;
        }
        return false;
    },
    
    logout() {
        this.isAuthenticated = false;
    },
    
    checkAuth() {
        return this.isAuthenticated;
    }
};

// Protección de contenido
function protectContent() {
    // Deshabilitar clic derecho
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Deshabilitar copia
    document.addEventListener('copy', e => e.preventDefault());
    
    // Ocultar barra de herramientas en videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('controlslist', 'nodownload');
        video.setAttribute('oncontextmenu', 'return false;');
    });
}

// Cargar galería
function loadGallery() {
    if(!auth.checkAuth()) {
        return;
    }
    
    // Aquí iría la lógica para cargar las imágenes y videos
    // Por ahora es un ejemplo básico
    const gallery = document.getElementById('gallery');
    
    // Ejemplo de imágenes
    const images = [
        'Recursos/file_00000000640061f5acfd89d3f55d55a3.png',
        'Recursos/Logo2.png'
    ];
    
    images.forEach(imgSrc => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'Imagen del portafolio';
        
        imgContainer.appendChild(img);
        gallery.appendChild(imgContainer);
    });
    
    protectContent();
}

// Inicializar
window.addEventListener('DOMContentLoaded', () => {
    loadGallery();
});