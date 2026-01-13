
/* ==========================================================================
   1. General Setup & Smooth Scroll
   ========================================================================== */

// סימון שה-JS נטען (עוזר ל-CSS לדעת מתי להפעיל אנימציות)
document.documentElement.classList.add('js-loaded');

// גלילה חלקה לקישורים בתפריט
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // סגירת התפריט במובייל אחרי לחיצה
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        }
    });
});

/* ==========================================================================
   2. Project Modals (חלונות קופצים לפרויקטים)
   ========================================================================== */

// פונקציה לפתיחת פרויקט
window.openProject = function(projectId) {
    console.log("Opening project:", projectId);

    const container = document.getElementById('project-details-container');
    const content = document.getElementById(projectId + '-content');

    if (!container || !content) {
        console.error("Error: Elements not found for", projectId);
        return;
    }

    // הצגת הקונטיינר הראשי
    container.classList.remove('d-none');
    container.classList.add('d-flex');

    // אנימציית כניסה לרקע (דיליי קטנטן כדי שה-CSS יתפוס)
    requestAnimationFrame(() => {
        container.classList.add('active');
    });

    // הסתרת כל התכנים האחרים
    document.querySelectorAll('.project-details-content').forEach(el => {
        el.classList.add('d-none');
        el.classList.remove('active-content');
    });

    // הצגת התוכן הספציפי
    content.classList.remove('d-none');
    
    // אנימציית כניסה לתוכן
    setTimeout(() => {
        content.classList.add('active-content');
    }, 50);

    // נעילת גלילה בדף הראשי
    document.body.style.overflow = 'hidden';
};

// פונקציה לסגירת פרויקט
window.closeProject = function() {
    const container = document.getElementById('project-details-container');
    
    // הסרת מחלקות האנימציה (מתחיל תהליך יציאה)
    container.classList.remove('active');
    document.querySelectorAll('.project-details-content').forEach(el => {
        el.classList.remove('active-content');
    });

    // המתנה לסיום האנימציה ואז הסתרה מלאה (400ms זה הזמן ב-CSS)
    setTimeout(() => {
        container.classList.remove('d-flex');
        container.classList.add('d-none');
        
        document.querySelectorAll('.project-details-content').forEach(el => {
            el.classList.add('d-none');
        });
        
        // שחרור הגלילה בדף
        document.body.style.overflow = 'auto';
    }, 400); 
};

// סגירה בלחיצה על הרקע הכהה
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('project-details-container');
    if (container) {
        container.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProject();
            }
        });
    }
});

// סגירה במקלדת (ESC)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProject();
    }
});

/* ==========================================================================
   3. TagCanvas (ענן תגיות ב-Hero)
   ========================================================================== */

window.addEventListener('load', function() {
    try {
        if(typeof TagCanvas !== 'undefined') {
            TagCanvas.Start('myCanvas', 'tags', {
                textColour: '#2D2E4E', // צבע הטקסט הכהה שלך
                outlineColour: 'transparent',
                reverse: true,
                depth: 0.8,
                maxSpeed: 0.05,
                initial: [0.1, -0.1],
                wheelZoom: false,
                imageScale: 1, // אם יש תמונות
                fadeIn: 1000,
                clickToFront: 600,
                shape: 'sphere'
            });
        } else {
            console.warn("TagCanvas library not loaded.");
        }
    } catch(e) {
        console.error("Canvas Error:", e);
        // Fallback: אם הקנבס נכשל, נציג את הרשימה הרגילה
        const canvasContainer = document.getElementById('myCanvasContainer');
        const tagsList = document.getElementById('tags');
        if(canvasContainer) canvasContainer.style.display = 'none';
        if(tagsList) tagsList.style.display = 'block';
    }
});

/* ==========================================================================
   4. Scroll Animations (Re-triggerable - אנימציות חוזרות)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {
    
    // הגדרות לצופה
    const observerOptions = {
        root: null,
        threshold: 0.15, // צריך לראות 15% מהאלמנט כדי שיתחיל
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // כשרואים את האלמנט - תפעיל אנימציה
                entry.target.classList.add('active');
            } else {
                // === התיקון: כשהאלמנט יוצא מהמסך - תאפס אותו ===
                // זה מה שגורם לאנימציה לקרות שוב כשחוזרים
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    // רשימת כל האלמנטים שצריכים אנימציה
    const sectionsToReveal = document.querySelectorAll(
        '.reveal-section, .reveal-grid, .stagger-item, .slide-in-left, .fade-up, .big-contact-bg-text, .reveal-slide-right, .slide-from-left, .slide-from-right'
    );

    sectionsToReveal.forEach(section => {
        observer.observe(section);
    });
});

/* ==========================================================================
   5. Contact Form Buttons Logic (בורר סוג פנייה)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {
    // בוחר את הכפתורים בטופס (אבל לא את כפתור השליחה)
    const contactBtns = document.querySelectorAll('.pill-btn:not([type="submit"])');
    const hiddenInput = document.getElementById('inquiry-type');

    contactBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // מונע רענון דף

            // 1. הסרת Active מכל הכפתורים
            contactBtns.forEach(b => {
                b.classList.remove('active');
                const dot = b.querySelector('.dot');
                if (dot) dot.classList.add('empty');
            });

            // 2. הוספת Active לכפתור שנלחץ
            this.classList.add('active');
            const activeDot = this.querySelector('.dot');
            if (activeDot) activeDot.classList.remove('empty');

            // 3. עדכון השדה הנסתר בטופס (אם קיים)
            if (hiddenInput) {
                hiddenInput.value = this.innerText.trim();
            }
        });
    });
});

