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

let viewportSyncRafId = 0;

function syncViewportContext() {
    const root = document.documentElement;
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;

    let viewportMode = 'desktop';
    if (width <= 768) {
        viewportMode = 'mobile';
    } else if (width <= 1180) {
        viewportMode = 'tablet';
    } else if (width >= 1600) {
        viewportMode = 'wide';
    }

    root.dataset.viewport = viewportMode;
    root.style.setProperty('--viewport-width', `${width}px`);
    root.style.setProperty('--viewport-height', `${height}px`);
}

function scheduleViewportContextSync() {
    if (viewportSyncRafId) {
        cancelAnimationFrame(viewportSyncRafId);
    }

    viewportSyncRafId = requestAnimationFrame(() => {
        viewportSyncRafId = 0;
        syncViewportContext();
    });
}

function getHashTarget(hash = window.location.hash) {
    if (!hash || hash.length < 2) return null;

    try {
        const id = decodeURIComponent(hash.slice(1));
        return document.getElementById(id) || document.querySelector(hash);
    } catch (error) {
        return null;
    }
}

function alignCurrentHashTarget() {
    const target = getHashTarget();
    if (!target) return;

    requestAnimationFrame(() => {
        if (typeof window.scrollToSectionTarget === 'function') {
            window.scrollToSectionTarget(target, { behavior: 'auto' });
            return;
        }

        target.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
}

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

    // The current design uses a static atmospheric background. Running the
    // old canvas animation every frame creates visible jank on this page.
    if (!matrixContainer.hasAttribute('data-animate')) return;

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
    
    let lastMatrixFrame = 0;

    function animateMatrix(timestamp) {
        if (timestamp - lastMatrixFrame > 90) {
            drawMatrix();
            lastMatrixFrame = timestamp;
        }

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
function syncPageInteractionState() {
    const contactForm = document.getElementById('contact-form');
    const lockedModal = document.querySelector('.locked-roadmap-modal');
    const hasOpenOverlay = Boolean(
        (contactForm && !contactForm.classList.contains('hidden')) || lockedModal
    );

    document.body.classList.toggle('is-modal-open', hasOpenOverlay);
    document.body.style.overflow = hasOpenOverlay ? 'hidden' : '';
}

// ИСПРАВЛЕННАЯ ФУНКЦИЯ openContactForm
function openContactForm() {
    const overlay = document.getElementById('form-overlay');
    const form = document.getElementById('contact-form');
    
    if (overlay && form) {
        overlay.classList.remove('hidden');
        form.classList.remove('hidden');
        syncPageInteractionState();
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
        currentStep = 1;
        syncPageInteractionState();
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

function animateCurrentStep(direction = 1) {
    const currentStepEl = document.querySelector('.form-step:not(.hidden)');
    if (!currentStepEl) return;

    currentStepEl.animate(
        [
            { opacity: 0, transform: `translateX(${direction * 18}px)` },
            { opacity: 1, transform: 'translateX(0)' },
        ],
        { duration: 220, easing: 'cubic-bezier(.22, 1, .36, 1)' }
    );
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateFormStep();
        animateCurrentStep(1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormStep();
        animateCurrentStep(-1);
    }
}

// Emoji reactions for form selects
function initFormReactions() {
    const levelSelect = document.getElementById('level');
    const goalSelect = document.getElementById('goal');
    const levelEmoji = document.getElementById('level-emoji');
    const goalEmoji = document.getElementById('goal-emoji');
    
    const levelEmojis = {
        'Новичок (не знаю ничего)': '😊',
        'Начинающий (знаю только основы)': '🧭',
        'Средний (могу писать простые API)': '😎',
        'Продвинутый (работаю в IT, нужно углубить знания)': '🚀'
    };
    
    const goalEmojis = {
        'профессия с 0': '🌱',
        'Сменить профессию на Backend-разработчика': '💼',
        'Запустить личный проект': '💻',
        'Системное повышение квалификации': '📈',
        'Решить конкретную техническую проблему': '🧩'
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
    if (voiceRecorder.dataset.bound === 'true') return;
    voiceRecorder.dataset.bound = 'true';
    
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
                const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
                mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
                audioChunks = [];
                
                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const recordedType = mediaRecorder.mimeType || 'audio/webm';
                    audioBlob = new Blob(audioChunks, { type: recordedType });
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
                showFormMessage('Не удалось получить доступ к микрофону.', 'error');
            }
        }
    });
}

function showFormMessage(message, type = 'error') {
    const contactFormEl = document.getElementById('contact-form');
    if (!contactFormEl) return;

    const oldMessage = contactFormEl.querySelector('.form-inline-message');
    if (oldMessage) oldMessage.remove();

    const messageEl = document.createElement('p');
    messageEl.className = `form-inline-message form-inline-message--${type}`;
    messageEl.textContent = message;
    contactFormEl.querySelector('.contact-form')?.prepend(messageEl);
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
        const extension = audioBlob.type.includes('webm') ? 'webm' : 'wav';
        formData.append('voice_message', audioBlob, `voice_recording.${extension}`);
    }
    
    // 2. Отправка данных на Flask-роутер
    fetch('/api/form', {
        method: 'POST',
        // ❗ НЕ УСТАНАВЛИВАЕМ ЗАГОЛОВОК 'Content-Type'. 
        // Браузер сам установит его как 'multipart/form-data' с правильным boundary.
        body: formData // 👈 ОТПРАВЛЯЕМ FormData НАПРЯМУЮ
    })
    .then(async response => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result.message || 'Ошибка сети или сервера');
        }
        return result;
    })
    .then(result => {
        showSuccessAnimation(contactFormEl, form);
    })
    .catch(error => {
        console.error('Submission error:', error);
        showFailureAnimation(contactFormEl, form, error.message);
    });

}

function showSuccessAnimation(contactFormEl, form) {
    const originalFormContent = contactFormEl.innerHTML;

    contactFormEl.animate(
        [
            { transform: 'translate(-50%, -50%) scale(1)' },
            { transform: 'translate(-50%, -50%) scale(1.035)' },
            { transform: 'translate(-50%, -50%) scale(1)' },
        ],
        { duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)' }
    );

    createMatrixConfetti();
    contactFormEl.innerHTML = `
        <div class="form-result form-result--success">
            <h3>Заявка принята</h3>
            <p>Я свяжусь с вами в ближайшее время в Telegram или по указанному контакту.</p>
            <small>Окно закроется автоматически</small>
        </div>
    `;

    setTimeout(() => {
        contactFormEl.innerHTML = originalFormContent;
        closeContactForm();
        form.reset();
        bindFormListeners();
    }, 5000);
}

function bindFormListeners() {
    initFormReactions();
    initVoiceRecording();

    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const form = document.getElementById('mentorship-form');

    if (nextBtn && nextBtn.dataset.bound !== 'true') {
        nextBtn.dataset.bound = 'true';
        nextBtn.addEventListener('click', nextStep);
    }

    if (prevBtn && prevBtn.dataset.bound !== 'true') {
        prevBtn.dataset.bound = 'true';
        prevBtn.addEventListener('click', prevStep);
    }

    if (form && form.dataset.bound !== 'true') {
        form.dataset.bound = 'true';
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitForm();
        });
    }
}

function rebindFormListeners() {
    bindFormListeners();
}

function showFailureAnimation(contactFormEl, form, errorMessage) {
    const originalFormContent = contactFormEl.innerHTML;
    
    contactFormEl.innerHTML = `
        <div class="form-result form-result--error">
            <h3>Ошибка отправки</h3>
            <p>${errorMessage}</p>
            <small>Окно закроется автоматически</small>
        </div>
    `;

    setTimeout(() => {
        contactFormEl.innerHTML = originalFormContent; 
        closeContactForm();
        bindFormListeners();
    }, 5000); 
}

// Matrix Confetti Effect
function createMatrixConfetti() {
    const colors = ['#b7ff5a', '#fffaf0', '#9ed8ff'];
    const confettiCount = 28;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'matrix-confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.setProperty('--fall-x', `${(Math.random() - 0.5) * 220}px`);
        confetti.style.setProperty('--fall-rotation', `${Math.random() * 360}deg`);
        confetti.style.animationDuration = `${Math.random() * 700 + 950}ms`;
        
        document.body.appendChild(confetti);
        confetti.addEventListener('animationend', () => confetti.remove(), { once: true });
    }
}

// Locked roadmap modal with glitch effect
function showLockedModal(moduleName) {
    if (document.querySelector('.locked-roadmap-modal')) {
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'locked-roadmap-modal';
    modal.innerHTML = `
        <div class="glitch-container">
            <span class="section-kicker">Следующий модуль</span>
            <h3 class="glitch" data-text="${moduleName}">${moduleName}</h3>
            <p>Запишитесь на консультацию, и я расскажу, как этот блок встроится в ваш личный roadmap.</p>
            <div class="flex">
                <button onclick="closeLockedModal()" class="btn-secondary">Закрыть</button>
                <button onclick="openContactForm(); closeLockedModal();" class="btn-primary">Заполнить форму</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    syncPageInteractionState();
    modal.querySelector('.glitch-container')?.animate(
        [
            { opacity: 0, transform: 'scale(.96)' },
            { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: 180, easing: 'cubic-bezier(.22, 1, .36, 1)' }
    );
    
    window.closeLockedModal = function() {
        const modalPanel = modal.querySelector('.glitch-container');
        const animation = modalPanel?.animate(
            [
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(.96)' },
            ],
            { duration: 140, easing: 'ease-out' }
        );

        const removeModal = () => {
            modal.remove();
            syncPageInteractionState();
        };

        if (animation) {
            animation.addEventListener('finish', removeModal, { once: true });
        } else {
            removeModal();
        }
    };
}

function initSectionScrollSnap() {
    const shouldUseNativeScroll = window.matchMedia(
        '(prefers-reduced-motion: reduce), (max-width: 768px), (pointer: coarse)'
    ).matches;

    if (shouldUseNativeScroll) {
        window.scrollToSectionTarget = (target, options = {}) => {
            const element = target instanceof HTMLElement ? target : getHashTarget(String(target || ''));
            if (!element) return false;

            element.scrollIntoView({
                behavior: options.behavior || 'smooth',
                block: 'start',
            });

            return true;
        };
        return;
    }

    const snapTargets = Array.from(
        document.querySelectorAll('main > section, main > .section, body > footer.site-footer')
    ).filter((node) => node instanceof HTMLElement);

    if (snapTargets.length === 0) return;

    let isSnapping = false;
    let snappingStartedAt = 0;
    let snapLockedUntil = 0;
    let snapTimeoutId = null;
    let scrollEndHandler = null;
    let fallbackSnapTimeoutId = null;
    let fallbackStartY = window.scrollY;
    let fallbackStartIndex = 0;
    let lastScrollY = window.scrollY;

    function isBelowSnapDeck() {
        const lastTarget = snapTargets[snapTargets.length - 1];
        if (!lastTarget) return false;

        const lastTop = getTargetTop(lastTarget);
        const lastHeight = Math.min(lastTarget.offsetHeight || window.innerHeight, window.innerHeight);
        return window.scrollY > lastTop + lastHeight * 0.62;
    }

    function isAtLastSnapTarget() {
        const lastTarget = snapTargets[snapTargets.length - 1];
        if (!lastTarget) return false;

        return window.scrollY >= getTargetTop(lastTarget) - 2;
    }

    function getActiveIndex(direction = 0) {
        const lastTarget = snapTargets[snapTargets.length - 1];
        const isAtDocumentBottom = window.scrollY >= getMaxScrollTop() - 2;

        if (direction < 0 && isAtDocumentBottom && isFooterTarget(lastTarget)) {
            return snapTargets.length - 1;
        }

        if (direction < 0 && isBelowSnapDeck()) {
            return snapTargets.length;
        }

        const anchorRatio = direction < 0 ? 0.72 : direction > 0 ? 0.3 : 0.48;
        const anchor = window.scrollY + window.innerHeight * anchorRatio;
        let activeIndex = 0;

        snapTargets.forEach((target, index) => {
            const top = target.getBoundingClientRect().top + window.scrollY;
            if (anchor >= top - 1) {
                activeIndex = index;
            }
        });

        return activeIndex;
    }

    function getScrollableAncestor(element) {
        let current = element instanceof Element ? element : null;

        while (current && current !== document.body) {
            const style = window.getComputedStyle(current);
            const canScrollY = /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight + 2;

            if (canScrollY) {
                return current;
            }

            current = current.parentElement;
        }

        return null;
    }

    function allowWheelOnScrollableContainer(target, deltaY) {
        if (!target) return false;

        const scrollableAncestor = getScrollableAncestor(target);
        if (!scrollableAncestor) return false;

        const atTop = scrollableAncestor.scrollTop <= 0;
        const atBottom = scrollableAncestor.scrollTop + scrollableAncestor.clientHeight >= scrollableAncestor.scrollHeight - 1;

        if (deltaY < 0 && !atTop) return true;
        if (deltaY > 0 && !atBottom) return true;

        return false;
    }

    function jumpToScrollTop(top) {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;

        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, top);
        root.style.scrollBehavior = previousScrollBehavior;
    }

    function getMaxScrollTop() {
        return Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
        );
    }

    function isFooterTarget(target) {
        return target instanceof HTMLElement && target.matches('body > footer.site-footer');
    }

    function getTargetTop(target) {
        const rawTop = target.getBoundingClientRect().top + window.scrollY;

        return Math.min(getMaxScrollTop(), Math.max(0, rawTop));
    }

    function scrollToTargetElement(target, behavior = 'smooth') {
        const targetTop = getTargetTop(target);

        clearTimeout(fallbackSnapTimeoutId);
        fallbackSnapTimeoutId = null;
        clearTimeout(snapTimeoutId);

        if (scrollEndHandler) {
            window.removeEventListener('scrollend', scrollEndHandler);
            scrollEndHandler = null;
        }

        isSnapping = true;
        snappingStartedAt = Date.now();

        const finishSnap = () => {
            clearTimeout(snapTimeoutId);

            if (scrollEndHandler) {
                window.removeEventListener('scrollend', scrollEndHandler);
                scrollEndHandler = null;
            }

            const finalTargetTop = getTargetTop(target);
            if (Math.abs(window.scrollY - finalTargetTop) > 0.5) {
                jumpToScrollTop(finalTargetTop);
            }

            isSnapping = false;
            snapLockedUntil = 0;
            fallbackStartY = window.scrollY;
            lastScrollY = window.scrollY;
        };

        if (behavior === 'auto') {
            snapLockedUntil = snappingStartedAt + 100;
            jumpToScrollTop(targetTop);
            requestAnimationFrame(finishSnap);
        } else {
            snapLockedUntil = Number.POSITIVE_INFINITY;

            if ('onscrollend' in window) {
                scrollEndHandler = finishSnap;
                window.addEventListener('scrollend', scrollEndHandler, { once: true });
            }

            window.scrollTo({
                top: targetTop,
                behavior,
            });

            snapTimeoutId = window.setTimeout(finishSnap, 1800);
        }
    }

    function snapToIndex(index, behavior = 'smooth') {
        const targetIndex = Math.max(0, Math.min(snapTargets.length - 1, index));
        const target = snapTargets[targetIndex];

        scrollToTargetElement(target, behavior);
    }

    window.scrollToSectionTarget = (target, options = {}) => {
        const element = target instanceof HTMLElement ? target : getHashTarget(String(target || ''));
        if (!element) return false;

        scrollToTargetElement(element, options.behavior || 'smooth');
        return true;
    };

    function isSnapLocked() {
        if (!isSnapping) return false;

        if (Date.now() > snapLockedUntil) {
            isSnapping = false;
            return false;
        }

        return true;
    }

    window.addEventListener('wheel', (event) => {
        if (document.body.classList.contains('is-modal-open')) {
            event.preventDefault();
            return;
        }

        if (event.ctrlKey) {
            return;
        }

        const target = event.target instanceof Element ? event.target : null;

        if (target && target.closest('input, textarea, select, option, button, [contenteditable="true"]')) {
            return;
        }

        if (allowWheelOnScrollableContainer(target, event.deltaY)) {
            return;
        }

        const direction = Math.sign(event.deltaY);
        if (!direction) return;

        if (isSnapLocked()) {
            event.preventDefault();
            return;
        }

        const currentIndex = getActiveIndex(direction);
        const nextIndex = Math.max(0, Math.min(snapTargets.length - 1, currentIndex + direction));

        if (nextIndex === currentIndex) return;

        event.preventDefault();
        snapToIndex(nextIndex);
    }, { passive: false });

    window.addEventListener('scroll', () => {
        if (document.body.classList.contains('is-modal-open') || isSnapLocked()) {
            lastScrollY = window.scrollY;
            return;
        }

        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;

        if (Math.abs(delta) < 2) return;

        if (delta > 0 && (isAtLastSnapTarget() || isBelowSnapDeck())) {
            clearTimeout(fallbackSnapTimeoutId);
            fallbackSnapTimeoutId = null;
            lastScrollY = currentY;
            return;
        }

        if (!fallbackSnapTimeoutId) {
            fallbackStartY = lastScrollY;
            fallbackStartIndex = getActiveIndex(delta);
        }

        clearTimeout(fallbackSnapTimeoutId);
        fallbackSnapTimeoutId = window.setTimeout(() => {
            if (isSnapLocked()) {
                fallbackSnapTimeoutId = null;
                lastScrollY = window.scrollY;
                return;
            }

            const totalDelta = window.scrollY - fallbackStartY;
            const direction = Math.sign(totalDelta);

            fallbackSnapTimeoutId = null;

            if (!direction || Math.abs(totalDelta) < 42) {
                lastScrollY = window.scrollY;
                return;
            }

            snapToIndex(fallbackStartIndex + direction);
        }, 130);

        lastScrollY = currentY;
    }, { passive: true });
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
                observer.unobserve(entry.target);
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

    const setMenuOpen = (isOpen) => {
        mobileMenu.classList.toggle('active', isOpen);
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    };

    mobileMenuBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        setMenuOpen(!mobileMenu.classList.contains('active'));
    });

    mobileMenu.addEventListener('click', (event) => {
        if (event.target instanceof Element && event.target.closest('a, button')) {
            setMenuOpen(false);
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            setMenuOpen(false);
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const hash = this.getAttribute('href');
            const target = getHashTarget(hash);

            if (target) {
                if (typeof window.scrollToSectionTarget === 'function') {
                    window.scrollToSectionTarget(target);
                } else {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                if (window.history && hash !== window.location.hash) {
                    window.history.pushState(null, '', hash);
                }
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                    document.getElementById('mobile-menu-btn')?.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}

function initActiveNavigation() {
    const links = Array.from(
        document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu__inner a[href^="#"]')
    );

    if (links.length === 0) return;

    const linkById = new Map();

    links.forEach((link) => {
        const hash = link.getAttribute('href') || '';
        if (hash.length <= 1) return;
        linkById.set(hash.slice(1), linkById.get(hash.slice(1)) || []);
        linkById.get(hash.slice(1)).push(link);
    });

    const sections = Array.from(
        document.querySelectorAll('main > section[id], body > footer')
    ).filter((section) => section instanceof HTMLElement);

    if (sections.length === 0) return;

    let activeId = null;
    let frameId = null;

    function setActive(nextId) {
        if (nextId === activeId) return;
        activeId = nextId;

        links.forEach((link) => {
            const isActive = linkById.has(nextId) && (linkById.get(nextId) || []).includes(link);
            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function getCurrentSectionId() {
        const viewportAnchor = window.innerHeight * 0.42;
        let currentSection = null;
        let currentScore = Number.POSITIVE_INFINITY;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const visibleScore = visibleHeight > 0 ? -visibleHeight * 0.08 : window.innerHeight;
            const sectionLine = rect.top + Math.min(rect.height, window.innerHeight) * 0.32;
            const score = Math.abs(sectionLine - viewportAnchor) + visibleScore;

            if (score < currentScore) {
                currentScore = score;
                currentSection = section;
            }
        });

        return currentSection ? currentSection.id : null;
    }

    function updateActiveLink() {
        frameId = null;
        const sectionId = getCurrentSectionId();
        setActive(linkById.has(sectionId) ? sectionId : null);
    }

    function scheduleActiveLinkUpdate() {
        if (frameId) return;
        frameId = window.requestAnimationFrame(updateActiveLink);
    }

    window.addEventListener('scroll', scheduleActiveLinkUpdate, { passive: true });
    window.addEventListener('resize', scheduleActiveLinkUpdate, { passive: true });
    window.addEventListener('hashchange', scheduleActiveLinkUpdate);

    scheduleActiveLinkUpdate();
}

function initBrandTypewriter() {
    const brandText = document.querySelector('.nav-brand__text');
    if (!brandText) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (!(brandText.textContent || '').trim()) return;

    const cycleMs = 10000;
    const eraseMs = 800;
    const typeMs = 1200;
    const holdMs = Math.max(0, cycleMs - eraseMs - typeMs);
    let cycleTimerId = null;
    let phaseTimerId = null;
    let stopped = false;

    function clearTimers() {
        if (cycleTimerId) {
            clearTimeout(cycleTimerId);
            cycleTimerId = null;
        }

        if (phaseTimerId) {
            clearTimeout(phaseTimerId);
            phaseTimerId = null;
        }
    }

    function setState(state) {
        brandText.classList.remove('is-erasing', 'is-typing');

        if (state) {
            brandText.classList.add(state);
        }
    }

    function queueNextCycle(delayMs) {
        clearTimers();
        cycleTimerId = window.setTimeout(() => {
            if (stopped) return;

            setState('is-erasing');

            phaseTimerId = window.setTimeout(() => {
                if (stopped) return;

                setState('is-typing');

                phaseTimerId = window.setTimeout(() => {
                    if (stopped) return;

                    setState(null);
                    queueNextCycle(holdMs);
                }, typeMs);
            }, eraseMs);
        }, delayMs);
    }

    queueNextCycle(cycleMs);
}


// Skill badges animation
function initSkillBadges() {
    const badges = document.querySelectorAll('.skill-badge');

    badges.forEach((badge) => {
        badge.setAttribute('data-animated', 'true');
    });
}

// Price cards hover effect
function initPriceCards() {
    // Hover states are handled in CSS. Avoid per-card JS listeners.
}

function initProgramAccordion() {
    const modules = Array.from(document.querySelectorAll('.program-module'));
    const detail = document.querySelector('.program-detail');
    const isDesktopLayout = () => window.matchMedia('(min-width: 900px)').matches;

    if (modules.length === 0) return;

    const getModuleData = (module) => {
        const body = module.querySelector('.program-module__body');
        const paragraphs = body ? Array.from(body.querySelectorAll('p')) : [];
        const resultEl = paragraphs.find((p) => p.classList.contains('program-module__result'));
        const textEl = paragraphs.find((p) => !p.classList.contains('program-module__result'));

        return {
            number: module.querySelector('.program-module__number')?.textContent.trim() || '',
            title: module.querySelector('.program-module__title')?.textContent.trim() || '',
            subtitle: module.querySelector('.program-module__subtitle')?.textContent.trim() || '',
            volume: module.querySelector('.program-module__volume')?.textContent.trim() || '',
            tags: Array.from(module.querySelectorAll('.program-module__tags span')).map((t) => t.textContent.trim()),
            text: textEl ? textEl.textContent.trim() : '',
            resultHtml: resultEl ? resultEl.innerHTML : '',
        };
    };

    const fillDetail = (module) => {
        if (!detail) return;
        const data = getModuleData(module);

        detail.querySelector('.program-detail__number').textContent = data.number;
        detail.querySelector('.program-detail__volume').textContent = data.volume;
        detail.querySelector('.program-detail__title').textContent = data.title;
        detail.querySelector('.program-detail__subtitle').textContent = data.subtitle;
        detail.querySelector('.program-detail__text').textContent = data.text;
        detail.querySelector('.program-detail__result').innerHTML = data.resultHtml;

        const tagsBox = detail.querySelector('.program-detail__tags');
        tagsBox.innerHTML = '';
        data.tags.forEach((tag) => {
            const chip = document.createElement('span');
            chip.textContent = tag;
            tagsBox.appendChild(chip);
        });
    };

    const closeModule = (module) => {
        const button = module.querySelector('.program-module__head');
        const panelId = button?.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        const toggle = module.querySelector('.program-module__toggle');

        button?.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
        module.classList.remove('is-open', 'program-module--active', 'is-selected');
        if (toggle) toggle.textContent = 'Подробнее';
    };

    const selectModule = (module, { openBody = false } = {}) => {
        modules.forEach((other) => {
            if (other !== module) closeModule(other);
        });

        module.classList.add('is-selected');
        fillDetail(module);

        const button = module.querySelector('.program-module__head');
        const panelId = button?.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        const toggle = module.querySelector('.program-module__toggle');

        if (openBody && panel) {
            button?.setAttribute('aria-expanded', 'true');
            panel.hidden = false;
            module.classList.add('is-open', 'program-module--active');
            if (toggle) toggle.textContent = 'Свернуть';
        }
    };

    modules.forEach((module) => {
        const button = module.querySelector('.program-module__head');
        if (!button) return;

        button.addEventListener('click', () => {
            if (isDesktopLayout()) {
                // Десктоп: список слева — панель деталей справа.
                selectModule(module);
                return;
            }

            // Мобайл/планшет: обычный аккордеон.
            const willOpen = button.getAttribute('aria-expanded') !== 'true';
            modules.forEach((other) => closeModule(other));
            if (willOpen) selectModule(module, { openBody: true });
        });
    });

    // По умолчанию показываем первый модуль в панели деталей.
    selectModule(modules[0]);
}

// Pricing Carousel for Mobile
function initPricingCarousel() {
    const carousel = document.querySelector('.pricing-carousel');
    const dotsContainer = document.getElementById('pricing-dots');
    
    if (!carousel || !dotsContainer) return;

    if (window.innerWidth > 768 || carousel.scrollWidth <= carousel.clientWidth + 8) {
        dotsContainer.innerHTML = '';
        return;
    }

    const cards = carousel.querySelectorAll('.price-card');
    const cardCount = cards.length;
    
    if (cardCount === 0) return;

    let currentIndex = 1; // По умолчанию вторая карточка (индекс 1)
    let lastAnimatedCard = null;
    let isSnapping = false; // Флаг, чтобы не срабатывал scroll слушатель во время snap

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
        if (!card || !document.body.contains(card)) return;

        if (lastAnimatedCard && lastAnimatedCard !== card) {
            lastAnimatedCard.classList.remove('active-card');
            lastAnimatedCard.style.transform = '';
        }

        card.style.transform = '';
        card.classList.add('active-card');
        card.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(1.025)' },
                { transform: 'scale(1)' },
            ],
            { duration: 240, easing: 'cubic-bezier(.22, 1, .36, 1)' }
        );

        lastAnimatedCard = card;
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
            card.classList.remove('active-card');
            card.style.transform = '';
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

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

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

}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    syncViewportContext();
    window.addEventListener('resize', scheduleViewportContextSync, { passive: true });
    window.addEventListener('orientationchange', scheduleViewportContextSync, { passive: true });

    initTerminalAnimation();
    initMatrixBackground();
    initCounterAnimation();
    initTextDecryption();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScrolling();
    initSectionScrollSnap();
    alignCurrentHashTarget();
    initActiveNavigation();
    initBrandTypewriter();
    initSkillBadges();
    initProgramAccordion();
    bindFormListeners();
    
    // Инициализируем карусель и карточки с небольшой задержкой,
    // чтобы гарантировать что все элементы в DOM
    setTimeout(() => {
        initPricingCarousel();
        initPriceCards();
    }, 100);
    
    // Close modal on overlay click
    document.getElementById('form-overlay')?.addEventListener('click', closeContactForm);
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeContactForm();
        }
    });
});








// Export functions for global access
window.openContactForm = openContactForm;
window.closeContactForm = closeContactForm;
window.showLockedModal = showLockedModal;
