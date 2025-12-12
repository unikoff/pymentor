// Enhanced Terminal Animation with Matrix Theme
const terminalMessages = [
    {
        text: '$ nikita_backend_mentor --initialize',
        delay: 0,
        color: '#b0b0b0'
    },
    {
        text: 'Loading mentor profile...',
        delay: 1000,
        color: '#00ff41'
    },
    {
        text: '✓ Experience: 2+ years in backend development',
        delay: 1500,
        color: '#39ff14'
    },
    {
        text: '✓ Specialization: Python, Django, FastAPI, PostgreSQL',
        delay: 2000,
        color: '#39ff14'
    },
    {
        text: '✓ Current projects: 3 active startups',
        delay: 2500,
        color: '#39ff14'
    },
    {
        text: '✓ Teaching methodology: Practical-first approach',
        delay: 3000,
        color: '#39ff14'
    },
    {
        text: '',
        delay: 3500,
        color: '#ffffff'
    },
    {
        text: '>>> import mentorship_program',
        delay: 4000,
        color: '#00d4ff'
    },
    {
        text: '>>> student = Mentorship("Nikita Kiryukhin")',
        delay: 4500,
        color: '#00d4ff'
    },
    {
        text: '>>> student.start_learning()',
        delay: 5000,
        color: '#00d4ff'
    },
    {
        text: 'Initializing personalized learning path...',
        delay: 5500,
        color: '#ffa500'
    },
    {
        text: 'Analyzing current skill level...',
        delay: 6000,
        color: '#ffa500'
    },
    {
        text: 'Generating custom curriculum...',
        delay: 6500,
        color: '#ffa500'
    },
    {
        text: '✓ Ready for new students',
        delay: 7000,
        color: '#39ff14'
    }
];

function initTerminalAnimation() {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return; // Safety check

    let currentIndex = 0;
    
    function typeMessage() {
        if (currentIndex < terminalMessages.length) {
            const message = terminalMessages[currentIndex];
            
            setTimeout(() => {
                const line = document.createElement('div');
                line.innerHTML = message.text || '&nbsp;';
                line.style.color = message.color;
                
                terminalOutput.appendChild(line);
                currentIndex++;
                
                // Scroll to bottom
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                
                typeMessage();
            }, message.delay);
        } else {
            // Restart animation after pause
            setTimeout(() => {
                terminalOutput.innerHTML = '';
                currentIndex = 0;
                typeMessage();
            }, 5000);
        }
    }
    
    typeMessage();
}

// Matrix Background Animation
function initMatrixBackground() {
    const matrixContainer = document.getElementById('matrix-bg');
    if (!matrixContainer) return;

    const matrixCanvas = document.createElement('canvas');
    const matrixCtx = matrixCanvas.getContext('2d');
    
    matrixContainer.appendChild(matrixCanvas);
    
    let matrixDrops = [];
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const matrixFontSize = 14;
    
    function resizeMatrixCanvas() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        
        // Initialize drops
        const columns = Math.floor(matrixCanvas.width / matrixFontSize);
        matrixDrops = [];
        for (let i = 0; i < columns; i++) {
            matrixDrops[i] = Math.random() * -100;
        }
    }
    
    function drawMatrix() {
        // Fade effect
        matrixCtx.fillStyle = 'rgba(10, 10, 10, 0.04)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        // Text properties
        matrixCtx.font = matrixFontSize + 'px JetBrains Mono';
        matrixCtx.fillStyle = '#00ff41';
        
        // Draw characters
        for (let i = 0; i < matrixDrops.length; i++) {
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            matrixCtx.fillText(char, i * matrixFontSize, matrixDrops[i] * matrixFontSize);
            
            // Reset drop when it goes off screen
            if (matrixDrops[i] * matrixFontSize > matrixCanvas.height && Math.random() > 0.975) {
                matrixDrops[i] = 0;
            }
            matrixDrops[i]++;
        }
    }
    
    resizeMatrixCanvas();
    
    function animateMatrix() {
        drawMatrix();
        requestAnimationFrame(animateMatrix);
    }
    
    animateMatrix();
    
    window.addEventListener('resize', resizeMatrixCanvas);
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Text Decryption Effect (Matrix-style)
function initTextDecryption() {
    const textElement = document.querySelector('.text-decryption');
    if (!textElement) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const text = entry.target;
            text.classList.add('visible');
            const originalText = text.innerHTML; // сохраняем HTML, чтобы <br> остались
            text.innerHTML = ''; // очищаем элемент

            const chars = [];
            for (let i = 0; i < originalText.length; i++) {
                const c = originalText[i];
                if (c === '<' && originalText.slice(i, i + 4) === '<br>') {
                    const br = document.createElement('br');
                    text.appendChild(br);
                    i += 3; // пропускаем 'br>'
                } else {
                    const span = document.createElement('span');
                    span.textContent = getRandomChar(); // стартуем с случайного символа
                    text.appendChild(span);
                    chars.push({span, char: c});
                }
            }

            // постепенно заменяем случайные символы на оригинальные
            chars.forEach(({span, char}, index) => {
                const totalIterations = 5 + Math.floor(Math.random() * 2); // сколько раз мелькает
                let count = 0;
                const interval = setInterval(() => {
                    if (count < totalIterations) {
                        span.textContent = getRandomChar();
                        count++;
                    } else {
                        span.textContent = char;
                        clearInterval(interval);
                    }
                }, 200 + Math.random() * 100);
            });

            observer.unobserve(text);
        });
    }, { threshold: 0.3 });

    observer.observe(textElement);
}

// Генерация случайного символа
function getRandomChar() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

// Pipeline Animation
function initPipelineAnimation() {
    const pipelineStages = document.querySelectorAll('.pipeline-stage');
    const connections = document.querySelectorAll('.pipeline-connection');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activate stages one by one
                pipelineStages.forEach((stage, index) => {
                    setTimeout(() => {
                        stage.classList.add('active');
                        
                        // Activate connections
                        if (index < connections.length) {
                            connections[index].style.opacity = '1';
                            connections[index].style.width = '100%';
                        }
                    }, index * 500);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const pipelineContainer = document.querySelector('.pipeline-container');
    if (pipelineContainer) {
        observer.observe(pipelineContainer);
    }
}

// Advanced Contact Form
let currentStep = 1;
const totalSteps = 4;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;

// ИСПРАВЛЕННАЯ ФУНКЦИЯ openContactForm
function openContactForm() {
    const overlay = document.getElementById('form-overlay');
    const form = document.getElementById('contact-form');
    
    if (overlay && form) {
        overlay.classList.remove('hidden');
        form.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        updateFormStep();
    } else {
        // Вывод ошибки в консоль, если элементы не найдены, но без остановки скрипта.
        console.error('🚨 Ошибка: Не найдены элементы модального окна (form-overlay или contact-form). Проверьте HTML.');
    }
}

function closeContactForm() {
    const overlay = document.getElementById('form-overlay');
    const form = document.getElementById('contact-form');
    
    if (overlay && form) {
        overlay.classList.add('hidden');
        form.classList.add('hidden');
        document.body.style.overflow = 'auto';
        currentStep = 1;
    }
}

function updateFormStep() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.add('hidden');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
    if(currentStepEl) currentStepEl.classList.remove('hidden');
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    if(progressFill) {
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = progress + '%';
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        if (currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
    }
    
    if (nextBtn) {
        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateFormStep();
        
        // Animate step transition using Anime.js
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.form-step:not(.hidden)',
                opacity: [0, 1],
                translateX: [50, 0],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormStep();
        
        // Animate step transition
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.form-step:not(.hidden)',
                opacity: [0, 1],
                translateX: [-50, 0],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }
}

// Emoji reactions for form selects
function initFormReactions() {
    const levelSelect = document.querySelector('select[name="level"]');
    const goalSelect = document.querySelector('select[name="goal"]');
    const levelEmoji = document.getElementById('level-emoji');
    const goalEmoji = document.getElementById('goal-emoji');
    
    const levelEmojis = {
        'beginner': '😊',
        'intermediate': '😎',
        'advanced': '🚀'
    };
    
    const goalEmojis = {
        'Карьера': '💼',
        'Проект': '💻',
        'Проблема': '🧩',
        'Повышение': '📈'
    };
    
    if (levelSelect && levelEmoji) {
        levelSelect.addEventListener('change', (e) => {
            levelEmoji.textContent = levelEmojis[e.target.value] || '🤔';
        });
    }
    
    if (goalSelect && goalEmoji) {
        goalSelect.addEventListener('change', (e) => {
            goalEmoji.textContent = goalEmojis[e.target.value] || '🎯';
        });
    }
}

// Voice Recording
function initVoiceRecording() {
    const voiceRecorder = document.getElementById('voice-recorder');
    const waveform = document.getElementById('waveform');
    const audioElement = document.getElementById('voice-recording');
    
    if (!voiceRecorder) return;
    
    voiceRecorder.addEventListener('click', async () => {
        if (isRecording) {
            // Stop recording
            if (mediaRecorder) {
                mediaRecorder.stop();
                isRecording = false;
                voiceRecorder.classList.remove('recording');
                waveform?.classList.add('hidden'); // Использовано ?. для безопасности
            }
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    // Cохраняем Blob в глобальной переменной audioBlob
                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); // 👈 Ключевая строка
                    const audioUrl = URL.createObjectURL(audioBlob);
                    if(audioElement) {
                        audioElement.src = audioUrl;
                        audioElement.classList.remove('hidden');
                    }
                    stream.getTracks().forEach(track => track.stop());
                };
                
                mediaRecorder.start();
                isRecording = true;
                voiceRecorder.classList.add('recording');
                if(waveform) waveform.classList.remove('hidden');
                
                // Auto stop after 20 seconds
                setTimeout(() => {
                    if (isRecording) {
                        mediaRecorder.stop();
                        isRecording = false;
                        voiceRecorder.classList.remove('recording');
                        if(waveform) waveform.classList.add('hidden');
                    }
                }, 20000);
                
            } catch (error) {
                console.error('Error accessing microphone:', error);
                alert('Не удалось получить доступ к микрофону');
            }
        }
    });
}


// Form submission
function submitForm() {
    const form = document.getElementById('mentorship-form');
    const contactFormEl = document.getElementById('contact-form');
    
    if (!form || !contactFormEl) return;
    
    const formData = new FormData(form);
    // const data = {}; // 👈 УДАЛЕНО. Сбор текстовых данных уже происходит в formData
    
    // 1. Сбор аудиоданных, если есть запись
    // Используем глобальную переменную audioBlob
    if (audioBlob) {
        // Добавляем Blob в FormData с ключом 'voice_message'.
        // Этот ключ ('voice_message') мы будем искать в main.py (request.files.get('voice_message')).
        formData.append('voice_message', audioBlob, 'voice_recording.wav'); 
    }
    
    // 2. Отправка данных на Flask-роутер
    fetch('/api/form', {
        method: 'POST',
        // ❗ НЕ УСТАНАВЛИВАЕМ ЗАГОЛОВОК 'Content-Type'. 
        // Браузер сам установит его как 'multipart/form-data' с правильным boundary.
        body: formData // 👈 ОТПРАВЛЯЕМ FormData НАПРЯМУЮ
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети или сервера');
        }
        return response.json();
    })
    .then(result => {
        console.log('Server response:', result);
        showSuccessAnimation(contactFormEl, form);
    })
    .catch(error => {
        console.error('Submission error:', error);
        showFailureAnimation(contactFormEl, form, error.message);
    });

}

// ❗ НОВАЯ ФУНКЦИЯ: Вынос логики анимации успеха
function showSuccessAnimation(contactFormEl, form) {
    // 1. Сохраняем оригинальное содержимое формы для восстановления
    const originalFormContent = contactFormEl.innerHTML;
    
    if (typeof anime !== 'undefined') {
        anime({
            targets: contactFormEl,
            translateX: ['-50%', '-50%'], 
            translateY: ['-50%', '-50%'], 
            scale: [1, 1.05, 1],
            duration: 600,
            easing: 'easeInOutQuad',
            
            complete: () => {
                contactFormEl.style.transform = ''; 
                createMatrixConfetti();
                contactFormEl.innerHTML = `
                    <div class="text-center py-10">
                        <h3 class="text-3xl font-bold neon-glow text-green-200 mb-4">✅ Заявка принята!</h3>
                        <p class="text-xl text-gray-300">Я свяжусь с вами в ближайшее время в Telegram/Email.</p>
                        <p class="text-sm text-gray-500 mt-4">(Окно закроется автоматически)</p>
                    </div>
                `;

                setTimeout(() => {
                    contactFormEl.innerHTML = originalFormContent; 
                    closeContactForm();
                    form.reset();
                    // ❗ Важно: После восстановления содержимого нужно 
                    // снова привязать все слушатели событий!
                    rebindFormListeners(); 
                }, 5000); 
            }
        });
    } else {
        closeContactForm();
        form.reset();
    }
}

// ❗ НОВАЯ ФУНКЦИЯ: Для повторной привязки слушателей
function rebindFormListeners() {
    // Вызовите функции инициализации для элементов формы, которые были заменены
    initFormReactions();
    initVoiceRecording();
    
    // Перепривязка кнопок
    document.getElementById('next-btn')?.addEventListener('click', nextStep);
    document.getElementById('prev-btn')?.addEventListener('click', prevStep);
    document.getElementById('mentorship-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm();
    });
}

// ❗ НОВАЯ ФУНКЦИЯ: Для обработки ошибок
function showFailureAnimation(contactFormEl, form, errorMessage) {
    const originalFormContent = contactFormEl.innerHTML;
    
    // Простое сообщение об ошибке
    contactFormEl.innerHTML = `
        <div class="text-center py-10">
            <h3 class="text-3xl font-bold neon-glow text-red-400 mb-4">❌ Ошибка отправки!</h3>
            <p class="text-xl text-gray-300">Не удалось отправить форму. ${errorMessage}</p>
            <p class="text-sm text-gray-500 mt-4">(Окно закроется автоматически)</p>
        </div>
    `;

    setTimeout(() => {
        contactFormEl.innerHTML = originalFormContent; 
        closeContactForm();
        rebindFormListeners(); 
    }, 5000); 
}

// Matrix Confetti Effect
function createMatrixConfetti() {
    const colors = ['#00ff41', '#00d4ff', '#8a2be2'];
    const confettiCount = 50;
    
    if (typeof anime === 'undefined') return;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'matrix-confetti'; // Добавили класс для потенциального CSS
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        anime({
            targets: confetti,
            translateY: window.innerHeight + 100,
            translateX: (Math.random() - 0.5) * 200,
            rotate: Math.random() * 360,
            
            // 💡 ВАЖНОЕ ИСПРАВЛЕНИЕ: Мы выставляем длительность анимации 
            // так, чтобы она закончилась задолго до таймаута в submitForm.
            // Максимальная длительность падения — 1800 мс, что меньше 2000 мс в таймауте.
            duration: Math.random() * 800 + 1000, 
            easing: 'easeInQuad',
            
            complete: () => {
                // Конфетти удаляется из DOM, как только падение завершено.
                // Это устраняет проблему "непропавшего" конфетти.
                if(document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            }
        });
    }
}

// Locked roadmap modal with glitch effect
function showLockedModal(moduleName) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 border border-green-400 rounded-lg p-8 max-w-md mx-4 glitch-container">
            <h3 class="text-2xl font-bold mb-4 neon-glow glitch" data-text="${moduleName}">${moduleName}</h3>
            <p class="text-gray-300 mb-6">Запишитесь на бесплатную консультацию и я расскажу вам подробнее об обучении.</p>
            <div class="flex gap-4">
                <button onclick="closeLockedModal()" class="px-4 py-2 border border-gray-600 rounded hover:border-green-400 transition-colors">Закрыть</button>
                <button onclick="openContactForm(); closeLockedModal();" class="btn-primary px-4 py-2">Заполнить форму</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal appearance
    if (typeof anime !== 'undefined') {
        anime({
            targets: modal.querySelector('.glitch-container'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
    
    window.closeLockedModal = function() {
        if (typeof anime !== 'undefined') {
            anime({
                targets: modal.querySelector('.glitch-container'),
                scale: [1, 0.8],
                opacity: [1, 0],
                duration: 200,
                easing: 'easeInQuad',
                complete: () => {
                    if(document.body.contains(modal)) document.body.removeChild(modal);
                }
            });
        } else {
             if(document.body.contains(modal)) document.body.removeChild(modal);
        }
    };
}

// Enhanced scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special animations for different sections
                if (typeof anime !== 'undefined') {
                    if (entry.target.classList.contains('roadmap-block')) {
                        const blocks = entry.target.parentElement.querySelectorAll('.roadmap-block');
                        blocks.forEach((block, index) => {
                            setTimeout(() => {
                                anime({
                                    targets: block,
                                    translateY: [50, 0],
                                    opacity: [0, 1],
                                    scale: [0.9, 1],
                                    duration: 600,
                                    easing: 'easeOutBack'
                                });
                            }, index * 200);
                        });
                    }
                    
                    if (entry.target.classList.contains('stats-card')) {
                        anime({
                            targets: entry.target,
                            rotateY: [90, 0],
                            opacity: [0, 1],
                            duration: 800,
                            easing: 'easeOutQuad'
                        });
                    }
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
}


// Skill badges animation
function initSkillBadges() {
    const badges = document.querySelectorAll('.skill-badge');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const badge = entry.target;
                
                // Убедимся, что анимация запускается только один раз
                if (!badge.hasAttribute('data-animated')) { 
                    
                    if (typeof anime !== 'undefined') {
                        anime({
                            targets: badge,
                            // ❗ Оставили только прозрачность: от 0 (невидимый) до 1 (видимый)
                            opacity: [0, 1], 
                            
                            // Устанавливаем более мягкую длительность
                            duration: 800, 
                            
                            // Используем более плавную функцию
                            easing: 'easeOutQuad', 
                            
                            // Задержка сохранена для эффекта "появления по очереди"
                            delay: Math.random() * 300 
                        });
                    }
                    
                    // Помечаем элемент как анимированный
                    badge.setAttribute('data-animated', 'true');
                    
                    // Отключаем наблюдение после анимации
                    observer.unobserve(badge);
                }
            }
        });
    }, { threshold: 0.5 }); // Элемент должен быть виден на 50%
    
    badges.forEach(badge => observer.observe(badge));
}

// Price cards hover effect
function initPriceCards() {
    const cards = document.querySelectorAll('.price-card');
    
    if (typeof anime === 'undefined') {
        console.warn('anime.js not loaded, price card animations disabled');
        return;
    }

    if (cards.length === 0) {
        console.warn('No price cards found');
        return;
    }

    console.log(`Found ${cards.length} price cards:`, cards);

    // Функция добавления слушателей к карточке
    function addCardListeners(card, index) {
        console.log(`Adding listeners to card ${index}:`, card);
        
        card.addEventListener('mouseenter', function() {
            console.log(`Mouse enter on card ${index}`);
            const isMobile = window.innerWidth <= 768;
            const scale = isMobile ? 1.02 : 1.05;
            
            anime({
                targets: this,
                scale: scale,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            console.log(`Mouse leave on card ${index}`);
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    }

    // Добавляем слушатели ко всем карточкам, включая первую
    cards.forEach((card, index) => {
        addCardListeners(card, index);
    });

    console.log(`✅ Initialized ${cards.length} price cards with hover animations`);
}

// Pricing Carousel for Mobile
function initPricingCarousel() {
    const carousel = document.querySelector('.pricing-carousel');
    const dotsContainer = document.getElementById('pricing-dots');
    
    if (!carousel || !dotsContainer) return;

    const cards = carousel.querySelectorAll('.price-card');
    const cardCount = cards.length;
    
    if (cardCount === 0) return;

    let currentIndex = 1; // По умолчанию вторая карточка (индекс 1)
    let lastAnimatedCard = null;
    let isSnapping = false; // Флаг, чтобы не срабатывал scroll слушатель во время snap
    let currentAnimationId = null; // ID текущей анимации для отмены

    // Добавляем CSS свойство scroll-snap для плавного скролла
    carousel.style.scrollSnapType = 'x mandatory';
    carousel.style.scrollBehavior = 'smooth';
    
    // Добавляем snap-align каждой карточке
    cards.forEach((card) => {
        card.style.scrollSnapAlign = 'center';
        card.style.scrollSnapStop = 'always';
        card.style.flexShrink = '0';
    });

    // Создаём точки навигации
    for (let i = 0; i < cardCount; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 1 ? 'active' : ''}`; // По умолчанию активна 2-я
        dot.setAttribute('data-index', i);
        
        dot.addEventListener('click', () => {
            currentIndex = i;
            snapToCard(i);
            // Воспроизводим анимацию
            playCardAnimation(i);
        });
        
        dotsContainer.appendChild(dot);
    }

    // Функция "прилипания" карточки к центру с гарантией (более агрессивная)
    function snapToCard(index) {
        if (index < 0 || index >= cardCount) return;

        const card = cards[index];
        const carouselWidth = carousel.offsetWidth;
        const cardWidth = card.offsetWidth;
        const cardLeft = card.offsetLeft;

        // Позиция для центрирования карточки
        const centerPosition = cardLeft - (carouselWidth - cardWidth) / 2;

        console.log(`📍 Snapping to card ${index} at position ${centerPosition}`);

        isSnapping = true;
        carousel.scrollLeft = centerPosition;
        
        // Дополнительная проверка через 50ms и корректировка если нужна
        setTimeout(() => {
            carousel.scrollLeft = centerPosition;
        }, 50);
        
        // Даем браузеру время завершить скролл
        setTimeout(() => {
            isSnapping = false;
            updateActiveDot(index);
        }, 350);
    }

    // Функция воспроизведения анимации карточки
    function playCardAnimation(index) {
        const card = cards[index];
        if (!card || typeof anime === 'undefined') return;

        console.log(`🎬 Playing animation on card ${index}:`, card);

        // Останавливаем анимацию на предыдущей карточке и убираем свечение и обводку
        if (lastAnimatedCard && lastAnimatedCard !== card) {
            console.log(`⏹️ Stopping animation on previous card`);
            anime.set(lastAnimatedCard, { scale: 1 });
            lastAnimatedCard.style.transform = '';
            lastAnimatedCard.style.boxShadow = ''; // УБИРАЕМ свечение со старой карточки
            lastAnimatedCard.style.border = '1px solid #333'; // Возвращаем темную обводку
            lastAnimatedCard.classList.remove('active-card');
        }

        // Убедимся что элемент существует в DOM
        if (!document.body.contains(card)) {
            console.warn(`⚠️ Card ${index} not in DOM!`);
            return;
        }

        // Полный сброс текущей карточки перед анимацией
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.border = '1px solid #333';
        card.classList.remove('active-card');
        anime.set(card, { scale: 1 });
        
        // Минимальная задержка для гарантии
        setTimeout(() => {
            console.log(`▶️ Starting animation on card ${index}`);
            
            // Анимируем масштаб И свечение одновременно
            currentAnimationId = anime({
                targets: card,
                scale: [1, 1.03, 1],
                duration: 300,
                easing: 'easeOutQuad',
                begin: (anim) => {
                    console.log(`✨ Glow started on card ${index}`);
                    // Добавляем свечение И зелёную обводку в начале
                    card.style.boxShadow = '0 0 25px rgba(0, 255, 65, 0.5), 0 0 15px rgba(0, 255, 65, 0.3)';
                    card.style.border = '1px solid var(--matrix-green)';
                    card.classList.add('active-card');
                },
                complete: () => {
                    console.log(`✅ Animation complete on card ${index}`);
                    // После анимации СБРАСЫВАЕМ ТОЛЬКО масштаб, но ОСТАВЛЯЕМ свечение!
                    anime.set(card, { scale: 1 });
                    card.style.transform = '';
                    // ❌ НЕ УБИРАЕМ свечение: card.style.boxShadow = '';
                }
            });

            lastAnimatedCard = card;
        }, 30);
    }

    // Функция обновления активной точки
    function updateActiveDot(index) {
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // При скролле определяем ближайшую карточку и обновляем точку (БЕЗ автоматического прилипания)
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        if (isSnapping) return; // Не срабатываем во время programmatic scroll

        // Мгновенно убираем свечение со всех карточек при начале свайпа
        cards.forEach((card) => {
            card.style.boxShadow = '';
            card.style.border = '1px solid #333';
        });

        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            let closestIndex = 0;
            let closestDistance = Infinity;

            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const carouselRect = carousel.getBoundingClientRect();
                
                const cardCenter = rect.left + rect.width / 2;
                const carouselCenter = carouselRect.left + carouselRect.width / 2;
                const distance = Math.abs(cardCenter - carouselCenter);

                console.log(`Card ${index}: distance=${distance.toFixed(0)}px`);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            console.log(`🎯 Closest card is ${closestIndex}`);

            // Если карточка изменилась, запускаем анимацию
            if (currentIndex !== closestIndex) {
                currentIndex = closestIndex;
                playCardAnimation(closestIndex);
            }
            
            updateActiveDot(closestIndex);
            // БЕЗ автоматического прилипания - пользователь уже свайпит вручную
        }, 50);
    });

    // Инициализируем начальную позицию на 2-ю карточку БЕЗ анимации скролла
    const card1 = cards[1];
    const carouselWidth = carousel.offsetWidth;
    const cardWidth = card1.offsetWidth;
    const cardLeft = card1.offsetLeft;
    const centerPosition = cardLeft - (carouselWidth - cardWidth) / 2;
    
    // Устанавливаем позицию напрямую БЕЗ анимации
    carousel.scrollLeft = centerPosition;
    updateActiveDot(1);
    
    // Активируем вторую карточку ТОЛЬКО на мобильных (max-width: 768px)
    if (window.innerWidth <= 768) {
        card1.classList.add('active-card');
        lastAnimatedCard = card1;
    }

    console.log('✅ Pricing carousel initialized with snap-to-center');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTerminalAnimation();
    initMatrixBackground();
    initCounterAnimation();
    initTextDecryption();
    initLessonFlowAnimation()
    initScrollAnimations();
    initMobileMenu();
    initSmoothScrolling();
    initSkillBadges();
    initFormReactions();
    initVoiceRecording();
    
    // Инициализируем карусель и карточки с небольшой задержкой,
    // чтобы гарантировать что все элементы в DOM
    setTimeout(() => {
        initPricingCarousel();
        initPriceCards();
    }, 100);
    
    // Form event listeners (используем ?. для безопасности, как в предыдущем ответе)
    document.getElementById('next-btn')?.addEventListener('click', nextStep);
    
    // ИСПРАВЛЕННЫЙ слушатель для prev-btn
    document.getElementById('prev-btn')?.addEventListener('click', prevStep);
    
    document.getElementById('mentorship-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm();
    });
    
    // Close modal on overlay click
    document.getElementById('form-overlay')?.addEventListener('click', closeContactForm);
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeContactForm();
        }
    });
});








// Функция для анимации ползунка по кривой SVG на основе времени
function initLessonFlowAnimation() {
    const section = document.querySelector('.lesson-flow-section');
    const path = document.getElementById('lesson-flow-path');
    const cursor = document.getElementById('flow-cursor');
    const steps = document.querySelectorAll('.lesson-step');

    // 💡 Настройки времени и скорости
    const animationDuration = 15000; // 15 секунд (в миллисекундах) для полного прохождения
    let startTime = null;
    let animationFrameId = null;

    // Безопасная проверка элементов
    if (!section || !path || !cursor || steps.length === 0) return;

    const pathLength = path.getTotalLength();

    // 1. Основной анимационный цикл
    function animateFlowCursor(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }

        const elapsedTime = timestamp - startTime;
        
        // ❌ УДАЛЕНИЕ ЗАЦИКЛИВАНИЯ И ОГРАНИЧЕНИЕ ПРОГРЕССА:
        // Вычисляем прогресс (от 0 до 1), используя Math.min, чтобы не превысить 1.
        const rawProgress = elapsedTime / animationDuration;
        const progressRatio = Math.min(rawProgress, 1); 

        // Вычисляем текущее расстояние по пути
        const currentDistance = pathLength * progressRatio;

        // Получаем координаты точки на SVG-пути
        const point = path.getPointAtLength(currentDistance);
        
        // Обновляем позицию ползунка
        cursor.setAttribute('cx', point.x);
        cursor.setAttribute('cy', point.y);
        
        // 2. УСЛОВИЕ ОСТАНОВКИ:
        // Если прогресс достиг 100% (progressRatio === 1), останавливаем цикл.
        if (progressRatio < 1) {
            // Продолжаем цикл анимации, только если не достигли конца
            animationFrameId = requestAnimationFrame(animateFlowCursor);
        } else {
            // Анимация завершена. Очищаем ID, чтобы ее можно было запустить снова.
            animationFrameId = null;
        }
        
        // 3. Логика для активации шагов (по прокрутке)
        steps.forEach(step => {
            const rect = step.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25) {
                step.querySelector('.fade-in-left')?.classList.add('visible');
                step.querySelector('.fade-in-right')?.classList.add('visible');
            } else {
                 step.querySelector('.fade-in-left')?.classList.remove('visible');
                 step.querySelector('.fade-in-right')?.classList.remove('visible');
            }
        });
    }
    
    // 4. Запуск/остановка по видимости
    function checkVisibilityAndStart() {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

        // Запускаем, только если секция видна И анимация не запущена
        if (isVisible && !animationFrameId) {
            startTime = null; // Сброс времени, чтобы анимация началась сначала
            animationFrameId = requestAnimationFrame(animateFlowCursor);
        } 
        // Если секция не видна, останавливаем цикл.
        else if (!isVisible && animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // Привязка слушателей
    window.addEventListener('resize', checkVisibilityAndStart);
    window.addEventListener('scroll', checkVisibilityAndStart);

    // Начальный запуск
    checkVisibilityAndStart();
}







// Export functions for global access
window.openContactForm = openContactForm;
window.closeContactForm = closeContactForm;
window.showLockedModal = showLockedModal;