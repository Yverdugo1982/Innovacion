document.addEventListener('DOMContentLoaded', () => {

    // ===== GESTIÓN DE PANTALLAS PRINCIPALES =====
    const screens = document.querySelectorAll('.screen');
    const startBtn = document.getElementById('start-btn');
    const navBtns = document.querySelectorAll('.nav-btn');

    const navigateTo = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active-screen'));
        document.getElementById(screenId)?.classList.add('active-screen');
    };
    startBtn.addEventListener('click', () => navigateTo('screen-timeline'));
    navBtns.forEach(button => button.addEventListener('click', () => navigateTo(button.dataset.target)));

    // ===== LÓGICA DE MODALES =====
    const textModal = document.getElementById('text-modal');
    const videoModal = document.getElementById('video-modal');
    const viewer3DModal = document.getElementById('viewer-3d-modal');
    const allModals = [textModal, videoModal, viewer3DModal];

    const closeAllModals = () => {
        allModals.forEach(modal => modal.classList.remove('active'));
        document.getElementById('modal-video')?.pause();
        document.getElementById('visor')?.pause(); // Pausar el visor 3D también
    };

    // --- Cierre de Modales ---
    document.querySelectorAll('.close-button').forEach(button => button.addEventListener('click', closeAllModals));
    window.addEventListener('click', (event) => allModals.includes(event.target) && closeAllModals());
    window.addEventListener('keydown', (event) => event.key === 'Escape' && closeAllModals());

    // --- Modales de la Línea de Tiempo (Presente) ---
    document.querySelectorAll('.timeline-node').forEach(node => {
        node.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = node.dataset.title;
            document.getElementById('modal-text').textContent = node.dataset.description;
            textModal.classList.add('active');
        });
    });
    document.getElementById('open-video-btn').addEventListener('click', () => {
        textModal.classList.remove('active');
        videoModal.classList.add('active');
        document.getElementById('modal-video').play();
    });

    // --- Modales de las Tarjetas (Futuro) ---
    document.querySelectorAll('.future-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.modalType;
            if (type === '3d-viewer') {
                viewer3DModal.classList.add('active');
            } else if (type === 'text') {
                document.getElementById('modal-title').textContent = card.dataset.modalTitle;
                document.getElementById('modal-text').textContent = card.dataset.modalContent;
                textModal.classList.add('active');
            }
        });
    });

    // ===== LÓGICA DEL VISOR 3D (BAKAN) =====
    const visor = document.getElementById('visor');
    const infoPanel = document.getElementById('info-panel');
    const infoTitle = document.getElementById('info-title');
    const infoText = document.getElementById('info-text');
    const viewButtons3D = document.querySelectorAll('#camera-views .view-btn');

    if (visor) {
        const viewpoints = {
            front: { orbit: "0deg 75deg 105%", target: "auto auto auto" },
            top: { orbit: "0deg 0deg auto", target: "auto auto auto" },
            side: { orbit: "90deg 75deg 105%", target: "auto auto auto" }
        };

        visor.addEventListener('load', () => goToView('front'));

        function goToView(viewName) {
            const view = viewpoints[viewName];
            if (!view) return;
            visor.cameraOrbit = view.orbit;
            visor.cameraTarget = view.target;
            viewButtons3D.forEach(b => b.classList.remove('active-view'));
            document.querySelector(`.view-btn[data-view="${viewName}"]`)?.classList.add('active-view');
        }

        viewButtons3D.forEach(btn => btn.addEventListener('click', () => goToView(btn.dataset.view)));

        visor.querySelectorAll('.hotspot').forEach(hotspot => {
            hotspot.addEventListener('click', () => {
                visor.cameraTarget = hotspot.dataset.target;
                visor.cameraOrbit = hotspot.dataset.orbit;
                infoTitle.textContent = hotspot.dataset.label;
                infoText.textContent = hotspot.dataset.info;
                infoPanel.classList.add('active');
            });
        });

        document.getElementById('close-panel').addEventListener('click', () => infoPanel.classList.remove('active'));

        visor.addEventListener('camera-change', (event) => {
            if (event.detail.source === 'user-interaction') {
                visor.pause();
                infoPanel.classList.remove('active');
            }
        });
    }
});