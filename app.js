document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. TABS SYSTEM FOR WORKFLOW PIPELINES
    // ==========================================
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active classes
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Add active class to clicked button
            button.classList.add("active");

            // Show corresponding content
            const tabId = button.getAttribute("data-tab");
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });

    // ==========================================
    // 2. FOLDER / FILE EXPLORER SIDEBAR NAVIGATION
    // ==========================================
    const folderItems = document.querySelectorAll(".folder-item");
    const folderViews = document.querySelectorAll(".folder-view");

    folderItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove active states
            folderItems.forEach(i => i.classList.remove("active"));
            folderViews.forEach(v => v.classList.remove("active"));

            // Add active state to clicked folder
            item.classList.add("active");

            // Show folder content
            const folderId = item.getAttribute("data-folder");
            const targetView = document.getElementById(folderId);
            if (targetView) {
                targetView.classList.add("active");
            }
        });
    });

    // ==========================================
    // 3. INTERACTIVE SVG MAP NAVIGATION & SPECS
    // ==========================================
    const mapElements = {
        "el-pond-a": "details-pond-a",
        "el-pond-b": "details-pond-b",
        "el-filters": "details-filters",
        "el-field-1": "details-field-1",
        "el-field-2": "details-field-2",
        "el-field-3": "details-field-3",
        "el-intercrop": "details-intercrop"
    };

    const detailCards = document.querySelectorAll(".detail-card");
    const defaultDetail = document.getElementById("details-default");

    // Loop and add event listeners to SVG elements
    Object.keys(mapElements).forEach(id => {
        const svgElement = document.getElementById(id);
        const detailId = mapElements[id];
        const targetCard = document.getElementById(detailId);

        if (svgElement && targetCard) {
            
            // Hover effect
            svgElement.addEventListener("mouseenter", () => {
                // Highlight corresponding detail card
                detailCards.forEach(c => c.classList.remove("active"));
                targetCard.classList.add("active");
            });

            svgElement.addEventListener("mouseleave", () => {
                // Return to active or default
                // You can keep the clicked one active
            });

            // Click effect to lock view
            svgElement.addEventListener("click", (e) => {
                e.stopPropagation();
                detailCards.forEach(c => c.classList.remove("active"));
                targetCard.classList.add("active");
                
                // Pulse feedback in CSS (simulate click highlight)
                svgElement.style.transform = "scale(1.02)";
                setTimeout(() => {
                    svgElement.style.transform = "scale(1)";
                }, 200);
            });
        }
    });

    // Click outside map elements returns to default instructions
    const svgMap = document.querySelector(".farm-svg");
    if (svgMap) {
        svgMap.addEventListener("click", () => {
            detailCards.forEach(c => c.classList.remove("active"));
            if (defaultDetail) {
                defaultDetail.classList.add("active");
            }
        });
    }

    // ==========================================
    // 4. MICRO-INTERACTIONS & ACTIVE NAV LINK
    // ==========================================
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // ==========================================
    // 5. MAP TOGGLE (SVG VS LEAFLET GIS)
    // ==========================================
    const mapToggleBtns = document.querySelectorAll(".map-toggle-btn");
    const mapViewPanels = document.querySelectorAll(".map-view-panel");
    let gisMap = null;

    function initGisMap() {
        if (gisMap) {
            // If already initialized, just update the size calculation (critical for Leaflet tabs)
            setTimeout(() => {
                gisMap.invalidateSize();
            }, 100);
            return;
        }

        // Initialize Leaflet map
        gisMap = L.map('live-gis-map');

        // Add Google Satellite Layer
        L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Map data &copy; Google Satellite Imagery'
        }).addTo(gisMap);

        // Coordinates from original FarmMap.html
        const farmFeatures = [
            {"name": "حوض تجميع وتخزين المياه A (بولي إيثيلين HDPE)", "type": "Polygon", "coordinates": [[30.3667717204591, 31.87897887169668], [30.36657865270039, 31.87892957373909], [30.36655794497629, 31.87904164729906], [30.36674367308918, 31.87908915258157], [30.3667717204591, 31.87897887169668]]}, 
            {"name": "حوض الموالح 1أ (8 أفدنة - ري حديث)", "type": "Polygon", "coordinates": [[30.36753100133991, 31.87826653026177], [30.36684869817183, 31.87812060510303], [30.36670618959099, 31.8789414068268], [30.36676681334106, 31.87896469469655], [30.366759034442, 31.87901053768212], [30.36738839512009, 31.87917933884644], [30.36753100133991, 31.87826653026177]]}, 
            {"name": "حوض المانجو 1ب (10 أفدنة - تحت التأهيل)", "type": "Polygon", "coordinates": [[30.36676184033209, 31.87810728305992], [30.36530558034007, 31.87775226358862], [30.36515731403004, 31.87867770607916], [30.36653102722636, 31.87905817497397], [30.36656061903983, 31.87891034942033], [30.36664795593913, 31.87892756560021], [30.36676184033209, 31.87810728305992]]}, 
            {"name": "حوض المانجو 2ب (تطوير شبكة الري)", "type": "Polygon", "coordinates": [[30.3669507224015, 31.87710771107792], [30.36546917476929, 31.876776140604], [30.36541667315027, 31.87728340046687], [30.36597741954946, 31.87742893071001], [30.36590338242079, 31.87783944285679], [30.36677581065288, 31.87802695157951], [30.3669507224015, 31.87710771107792]]}, 
            {"name": "حوض المياه ومحطة الفلترة الرئيسية B2 (5,000 م³)", "type": "Polygon", "coordinates": [[30.36796313400088, 31.87620518969295], [30.36814510494346, 31.87523116607996], [30.36625984550361, 31.87481802172995], [30.36606974121959, 31.87582134203363], [30.36796313400088, 31.87620518969295]]}, 
            {"name": "مشروع التكثيف 3أ (0.95 فدان - برحي وروزماري)", "type": "Polygon", "coordinates": [[30.368048, 31.877272], [30.368427, 31.877353], [30.368609, 31.876408], [30.368224, 31.876330], [30.368048, 31.877272]]}, 
            {"name": "مشروع التكثيف 2أ (3.36 فدان - برحي وروزماري)", "type": "Polygon", "coordinates": [[30.368402, 31.877401], [30.367031, 31.877110], [30.366869, 31.878042], [30.368231, 31.878359], [30.368402, 31.877401]]}, 
            {"name": "مشروع التكثيف 3أ1 (2.52 فدان - برحي وروزماري)", "type": "Polygon", "coordinates": [[30.36822158133792, 31.8763256567203], [30.36715779687023, 31.87610396368709], [30.36702551338116, 31.87701402086329], [30.36803804004113, 31.87724887783632], [30.36822158133792, 31.8763256567203]]}
        ];

        const bounds = [];

        farmFeatures.forEach(f => {
            if (f.type === 'Polygon') {
                const isIntercrop = f.name.includes("التكثيف") || f.name.includes("روزماري");
                const polyColor = isIntercrop ? '#00e676' : '#20c997';
                const polyFillColor = isIntercrop ? '#ffc107' : '#20c997';
                const polyOpacity = isIntercrop ? 0.35 : 0.18;
                const polyWeight = isIntercrop ? 4 : 3;

                const poly = L.polygon(f.coordinates, {
                    color: polyColor,
                    fillColor: polyFillColor,
                    fillOpacity: polyOpacity,
                    weight: polyWeight
                }).addTo(gisMap);

                poly.bindPopup(`
                    <div style="direction: rtl; text-align: right; font-family: 'Cairo', sans-serif;">
                        <strong style="color: ${isIntercrop ? '#00e676' : '#20c997'}; font-size: 1.05rem;">
                            <i class="fa-solid ${isIntercrop ? 'fa-seedling' : 'fa-layer-group'}"></i> ${f.name}
                        </strong>
                        <hr style="margin: 8px 0; border: 0; border-top: 1px solid rgba(255,255,255,0.15);">
                        <p style="margin: 0; font-size: 0.85rem; color: #e9ecef;">
                            ${isIntercrop ? '<strong>مشروع استثماري واعد:</strong> نخل برحي (8×8م) محمل بالروزماري لإنتاج الزيت العطري بالتقطير البخاري. ري مزدوج حديث مستقل.' : 'تم إسقاط الحدود من ملف الـ KML المساحي لمشروع تأهيل المزرعة.'}
                        </p>
                    </div>
                `);

                f.coordinates.forEach(pt => {
                    bounds.push(pt);
                });
            }
        });

        if (bounds.length > 0) {
            gisMap.fitBounds(bounds);
        } else {
            gisMap.setView([30.367, 31.877], 15);
        }
    }

    mapToggleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            mapToggleBtns.forEach(b => b.classList.remove("active"));
            mapViewPanels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");

            const targetViewId = btn.getAttribute("data-map-view");
            const targetPanel = document.getElementById(targetViewId);
            if (targetPanel) {
                targetPanel.classList.add("active");

                if (targetViewId === "gis-view") {
                    initGisMap();
                }
            }
        });
    });

    // ==========================================
    // 6. CARD NESTED TABS SYSTEM
    // ==========================================
    const cardTabButtons = document.querySelectorAll(".card-tab-btn");
    cardTabButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent map click triggers
            const tabId = button.getAttribute("data-card-tab");
            
            // Get parent detail card
            const parentCard = button.closest(".detail-card");
            if (parentCard) {
                // Find all buttons and contents in this parent card only
                const buttons = parentCard.querySelectorAll(".card-tab-btn");
                const contents = parentCard.querySelectorAll(".card-tab-content");
                
                buttons.forEach(btn => btn.classList.remove("active"));
                contents.forEach(cnt => cnt.classList.remove("active"));
                
                button.classList.add("active");
                const targetContent = parentCard.querySelector(`#${tabId}`);
                if (targetContent) {
                    targetContent.classList.add("active");
                }
            }
        });
    });

    // ==========================================
    // 7. AUTOMATIC BACKWASH SIMULATOR LOGIC
    // ==========================================
    const btnTriggerBackwash = document.getElementById("btn-trigger-backwash");
    const btnResetFiltration = document.getElementById("btn-reset-filtration");
    const simStatusDot = document.getElementById("sim-status-dot");
    const simStatusText = document.getElementById("sim-status-text");
    const simDpVal = document.getElementById("sim-dp-val");
    const simExplanation = document.getElementById("sim-explanation-text");

    let backwashSequenceTimer = null;
    let currentBackwashStep = 0;

    const tanks = [
        { id: "tank-1", valveId: "valve-1", drainId: "drain-1", name: "خزان الرمل 1" },
        { id: "tank-2", valveId: "valve-2", drainId: "drain-2", name: "خزان الرمل 2" },
        { id: "tank-3", valveId: "valve-3", drainId: "drain-3", name: "خزان الرمل 3" }
    ];

    const discFilters = ["disc-1", "disc-2"];

    function resetToNormalFiltration() {
        if (backwashSequenceTimer) {
            clearTimeout(backwashSequenceTimer);
            backwashSequenceTimer = null;
        }
        currentBackwashStep = 0;

        // Reset buttons
        if (btnTriggerBackwash) btnTriggerBackwash.classList.remove("active");
        if (btnResetFiltration) btnResetFiltration.classList.add("active");

        // Reset status
        if (simStatusDot) simStatusDot.className = "status-indicator normal";
        if (simStatusText) simStatusText.textContent = "حالة النظام: ترشيح طبيعي";
        if (simDpVal) {
            simDpVal.textContent = "0.2";
            simDpVal.className = "dp-normal";
        }

        // Reset Explanation
        if (simExplanation) {
            simExplanation.innerHTML = `
                <i class="fa-solid fa-circle-info"></i>
                <span>يتدفق الماء النظيف (الأزرق) من خط الترسيب ويمر عبر خزانات الرمل وفلاتر الديسك إلى شبكة ري الحقل. ضغط النظام آمن ومستقر.</span>
            `;
        }

        // Reset tanks & valves
        tanks.forEach(tank => {
            const el = document.getElementById(tank.id);
            const valve = document.getElementById(tank.valveId);
            const drain = document.getElementById(tank.drainId);
            if (el) {
                el.classList.add("active-filter");
                el.classList.remove("active-backwash");
            }
            if (valve) valve.textContent = "عادي";
            if (drain) drain.style.background = "rgba(255,255,255,0.03)";
        });

        // Reset disc filters
        discFilters.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add("active-filter");
        });
    }

    function runSequentialBackwash() {
        if (backwashSequenceTimer) {
            clearTimeout(backwashSequenceTimer);
        }

        // Toggle buttons
        if (btnResetFiltration) btnResetFiltration.classList.remove("active");
        if (btnTriggerBackwash) btnTriggerBackwash.classList.add("active");

        // Set state to backwash warning
        if (simStatusDot) simStatusDot.className = "status-indicator backwash";
        if (simDpVal) {
            simDpVal.textContent = "0.7";
            simDpVal.className = "dp-warning";
        }

        function runStep() {
            // Reset all tanks to default filtering state
            tanks.forEach(tank => {
                const el = document.getElementById(tank.id);
                const valve = document.getElementById(tank.valveId);
                const drain = document.getElementById(tank.drainId);
                if (el) {
                    el.classList.add("active-filter");
                    el.classList.remove("active-backwash");
                }
                if (valve) valve.textContent = "عادي";
                if (drain) drain.style.background = "rgba(255,255,255,0.03)";
            });

            if (currentBackwashStep < 3) {
                const currentTank = tanks[currentBackwashStep];
                if (simStatusText) simStatusText.textContent = `دورة الغسيل العكسي: جاري غسيل ${currentTank.name}...`;
                if (simExplanation) {
                    simExplanation.innerHTML = `
                        <i class="fa-solid fa-triangle-exclamation" style="color: #f5b041;"></i>
                        <span>محبس AZUD 3-Way الهيدروليكي يحول التدفق في ${currentTank.name} للصرف. يتدفق الماء عكسياً لإزالة الرواسب، ويستمر الخزانان الآخران في الري.</span>
                    `;
                }

                // Highlight active backwash tank
                const tankEl = document.getElementById(currentTank.id);
                const valveEl = document.getElementById(currentTank.valveId);
                const drainEl = document.getElementById(currentTank.drainId);

                if (tankEl) {
                    tankEl.classList.remove("active-filter");
                    tankEl.classList.add("active-backwash");
                }
                if (valveEl) valveEl.textContent = "عكسي";
                if (drainEl) drainEl.style.background = "#ff5252";

                currentBackwashStep++;
                backwashSequenceTimer = setTimeout(runStep, 3500); // 3.5 seconds per tank
            } else {
                // Complete sequence
                if (simStatusDot) simStatusDot.className = "status-indicator normal";
                if (simStatusText) simStatusText.textContent = "اكتمل الغسيل العكسي بنجاح!";
                if (simDpVal) {
                    simDpVal.textContent = "0.0";
                    simDpVal.className = "dp-normal";
                }
                if (simExplanation) {
                    simExplanation.innerHTML = `
                        <i class="fa-solid fa-circle-check" style="color: #20c997;"></i>
                        <span>تم تنظيف رمل السيليكا ذاتياً بالكامل. انخفض فرق الضغط إلى 0.0 بار. يعود النظام تدريجياً لوضع التشغيل الطبيعي.</span>
                    `;
                }

                // Return all tanks to normal filtration
                tanks.forEach(tank => {
                    const el = document.getElementById(tank.id);
                    const valve = document.getElementById(tank.valveId);
                    if (el) el.classList.add("active-filter");
                    if (valve) valve.textContent = "عادي";
                });

                // Reset buttons and return to normal operation after 4 seconds
                backwashSequenceTimer = setTimeout(resetToNormalFiltration, 4000);
            }
        }

        currentBackwashStep = 0;
        runStep();
    }

    if (btnTriggerBackwash && btnResetFiltration) {
        btnTriggerBackwash.addEventListener("click", (e) => {
            e.stopPropagation();
            runSequentialBackwash();
        });

        btnResetFiltration.addEventListener("click", (e) => {
            e.stopPropagation();
            resetToNormalFiltration();
        });

        // Initialize state on page load
        resetToNormalFiltration();
    }

});


