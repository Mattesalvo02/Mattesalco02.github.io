document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       Navbar Scroll Effect
       ========================================== */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================
       Mobile Menu Toggle
       ========================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Blocca lo scroll del body quando il menu è aperto
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Chiudi il menu quando si clicca su un link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================
       Form Submission (Reale tramite PHP)
       ========================================== */
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            // Animazione di caricamento
            btn.innerText = 'Invio in corso...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            // Raccolta dati form
            const formData = new FormData(contactForm);

            // Chiamata al file PHP
            fetch('invia_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Successo
                    btn.innerText = 'Messaggio Inviato!';
                    btn.style.backgroundColor = '#4CAF50'; // Verde successo
                    btn.style.color = '#fff';
                    contactForm.reset();
                } else {
                    // Errore validazione o invio
                    btn.innerText = 'Errore di invio';
                    btn.style.backgroundColor = '#f44336'; // Rosso errore
                    btn.style.color = '#fff';
                    alert(data.message || 'Si è verificato un errore.');
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                btn.innerText = 'Errore di connessione';
                btn.style.backgroundColor = '#f44336';
                btn.style.color = '#fff';
            })
            .finally(() => {
                // Torna al bottone originale dopo 4 secondi
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 4000);
            });
        });
    }

});
