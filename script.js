document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const dropZoneMessage = document.getElementById('dropZoneMessage');
    const outputCanvas = document.getElementById('outputCanvas');
    const outputCtx = outputCanvas.getContext('2d');
    const svgPreview = document.getElementById('svgPreview');
    const algorithm = document.getElementById('algorithm');
    const colorMode = document.getElementById('colorMode');
    const customColorPickers = document.getElementById('customColorPickers');
    const multiColorPickers = document.getElementById('multiColorPickers');
    const colorPickersContainer = document.getElementById('colorPickersContainer');
    const addColorBtn = document.getElementById('addColorBtn');
    const fgColor = document.getElementById('fgColor');
    const bgColor = document.getElementById('bgColor');
    const transparentBg = document.getElementById('transparentBg');
    const threshold = document.getElementById('threshold');
    const thresholdValue = document.getElementById('thresholdValue');
    const ditherAmount = document.getElementById('ditherAmount');
    const ditherAmountValue = document.getElementById('ditherAmountValue');
    const contrast = document.getElementById('contrast');
    const contrastValue = document.getElementById('contrastValue');
    const brightness = document.getElementById('brightness');
    const brightnessValue = document.getElementById('brightnessValue');
    const saturation = document.getElementById('saturation');
    const saturationValue = document.getElementById('saturationValue');
    const hue = document.getElementById('hue');
    const hueValue = document.getElementById('hueValue');
    const blur = document.getElementById('blur');
    const blurValue = document.getElementById('blurValue');
    const blockSize = document.getElementById('blockSize');
    const blockSizeValue = document.getElementById('blockSizeValue');
    const blackPoint = document.getElementById('blackPoint');
    const blackPointValue = document.getElementById('blackPointValue');
    const midPoint = document.getElementById('midPoint');
    const midPointValue = document.getElementById('midPointValue');
    const whitePoint = document.getElementById('whitePoint');
    const whitePointValue = document.getElementById('whitePointValue');
    const resetBtn = document.getElementById('resetBtn');
    const exportPng = document.getElementById('exportPng');
    const exportSvg = document.getElementById('exportSvg');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const notification = document.getElementById('notification');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const svgToggle = document.getElementById('svgToggle');
    const pngToggle = document.getElementById('pngToggle');
    
    // Background color picker for drop zone
    const dropZoneBgColor = document.getElementById('dropZoneBgColor');
    const bgColorPicker = document.getElementById('bgColorPicker');
    let isDefaultBackground = true;
    
    // Add pixel sort controls
    const pixelSortToggle = document.getElementById('pixelSortToggle');
    const pixelSortControls = document.getElementById('pixelSortControls');
    const pixelSortDirectionButtons = document.querySelectorAll('.sort-direction-btn');
    let currentSortDirection = 'horizontal'; // Default direction
    const pixelSortThreshold = document.getElementById('pixelSortThreshold');
    const pixelSortThresholdValue = document.getElementById('pixelSortThresholdValue');
    const pixelSortAmount = document.getElementById('pixelSortAmount');
    const pixelSortAmountValue = document.getElementById('pixelSortAmountValue');
    const pixelSortCriteriaButtons = document.querySelectorAll('.sort-criteria-btn');
    let currentSortCriteria = 'brightness'; // Default sort criteria
    const ditherToggle = document.getElementById('ditherToggle');
    
    // Add JPEG artifact controls
    const jpegGlitchToggle = document.getElementById('jpegGlitchToggle');
    const jpegGlitchControls = document.getElementById('jpegGlitchControls');
    const jpegBlockSize = document.getElementById('jpegBlockSize');
    const jpegBlockSizeValue = document.getElementById('jpegBlockSizeValue');
    const jpegQuantization = document.getElementById('jpegQuantization');
    const jpegQuantizationValue = document.getElementById('jpegQuantizationValue');
    const jpegFreqNoise = document.getElementById('jpegFreqNoise');
    const jpegFreqNoiseValue = document.getElementById('jpegFreqNoiseValue');
    const jpegMode = document.getElementById('jpegMode');
    
    // Add the new sine wave controls to the global variables
    const sineWaveLength = document.getElementById('sineWaveLength');
    const sineWaveAmplitude = document.getElementById('sineWaveAmplitude');
    const sineWaveThickness = document.getElementById('sineWaveThickness');
    const sineWaveRotation = document.getElementById('sineWaveRotation');
    const sineWaveCount = document.getElementById('sineWaveCount');
    const sineWaveDistance = document.getElementById('sineWaveDistance');
    const sineWaveLengthValue = document.getElementById('sineWaveLengthValue');
    const sineWaveAmplitudeValue = document.getElementById('sineWaveAmplitudeValue');
    const sineWaveThicknessValue = document.getElementById('sineWaveThicknessValue');
    const sineWaveRotationValue = document.getElementById('sineWaveRotationValue');
    const sineWaveCountValue = document.getElementById('sineWaveCountValue');
    const sineWaveDistanceValue = document.getElementById('sineWaveDistanceValue');
    const sineWaveControls = document.getElementById('sineWaveControls');
    
    // Variables
    let originalImage = null;
    let zoom = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let processingTimeout = null;
    let currentPreviewMode = 'png'; // Default to PNG mode
    let isInverted = false; // Track if colors are inverted

    // State
    let originalImageData = null;
    let currentSvgContent = ''; // Store the SVG content

    // Initial values
    contrastValue.value = contrast.value;
    brightnessValue.value = brightness.value;
    saturationValue.value = saturation.value;
    hueValue.value = hue.value + "°";
    blurValue.value = blur.value;
    thresholdValue.value = threshold.value;
    ditherAmountValue.value = ditherAmount.value;
    blockSizeValue.value = blockSize.value + "%";
    blackPointValue.value = blackPoint.value;
    midPointValue.value = midPoint.value;
    whitePointValue.value = whitePoint.value;
    
    // Initialize UI state and event handlers
    updateColorPickerVisibility(); // Initialize color picker visibility
    initZoomAndDrag();
    initSectionToggle();
    initThemeColorPicker(); // Add this line
    
    // Check if all panels are collapsed
    checkAllPanelsCollapsed();
    
    // Apply initial preview mode
    applyPreviewMode();

    // Set up the handlers for drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefault, false);
        document.body.addEventListener(eventName, preventDefault, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);
    
    // Background color picker event listeners
    bgColorPicker.addEventListener('click', function(e) {
        if (e.target === this || e.target.tagName === 'I') {
            toggleDropZoneBackground();
        }
    });
    
    dropZoneBgColor.addEventListener('input', function() {
        isDefaultBackground = false;
        updateDropZoneBackground(this.value);
    });

    // Set up the event listeners for controls
    algorithm.addEventListener('change', processImage);
    contrast.addEventListener('input', updateContrastValue);
    brightness.addEventListener('input', updateBrightnessValue);
    saturation.addEventListener('input', updateSaturationValue);
    hue.addEventListener('input', updateHueValue);
    blur.addEventListener('input', updateBlurValue);
    threshold.addEventListener('input', updateThresholdValue);
    ditherAmount.addEventListener('input', updateDitherAmountValue);
    blockSize.addEventListener('input', updateBlockSizeValue);
    colorMode.addEventListener('change', handleColorModeChange);
    fgColor.addEventListener('change', processImage);
    transparentBg.addEventListener('change', function() {
        bgColor.disabled = this.checked;
        
        // Add or remove disabled appearance
        if (this.checked) {
            bgColor.parentElement.classList.add('disabled');
        } else {
            bgColor.parentElement.classList.remove('disabled');
        }
        
        processImage();
    });
    bgColor.addEventListener('change', processImage);
    blackPoint.addEventListener('input', updateBlackPointValue);
    midPoint.addEventListener('input', updateMidPointValue);
    whitePoint.addEventListener('input', updateWhitePointValue);
    
    // Add pixel sort event listeners
    pixelSortToggle.addEventListener('change', togglePixelSortControls);
    pixelSortDirectionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            pixelSortDirectionButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update current sort direction
            currentSortDirection = this.getAttribute('data-value');
            // Process the image with new direction
            processImage();
        });
    });
    pixelSortThreshold.addEventListener('input', updatePixelSortThresholdValue);
    pixelSortAmount.addEventListener('input', updatePixelSortAmountValue);
    ditherToggle.addEventListener('change', handleDitherToggleChange);
    
    // Initialize sort criteria buttons
    pixelSortCriteriaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            pixelSortCriteriaButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update current sort criteria
            currentSortCriteria = this.getAttribute('data-value');
            // Process the image with new criteria
            processImage();
        });
    });
    
    // Add JPEG artifact event listeners
    jpegGlitchToggle.addEventListener('change', toggleJpegGlitchControls);
    jpegBlockSize.addEventListener('input', updateJpegBlockSizeValue);
    jpegQuantization.addEventListener('input', updateJpegQuantizationValue);
    jpegFreqNoise.addEventListener('input', updateJpegFreqNoiseValue);
    jpegMode.addEventListener('change', processImage);
    
    // Add event listeners for input field changes
    setupInputFieldListeners();
    
    exportPng.addEventListener('click', handleExportPng);
    exportSvg.addEventListener('click', handleExportSvg);
    document.getElementById('printImage').addEventListener('click', handlePrintImage);
    document.getElementById('invertBtn').addEventListener('click', toggleInvertColors);
    resetBtn.addEventListener('click', resetSettings);
    
    // Set up toggle button event listeners
    svgToggle.addEventListener('click', () => togglePreviewMode('svg'));
    pngToggle.addEventListener('click', () => togglePreviewMode('png'));

    // Add event listeners for the new sliders
    if (sineWaveLength) sineWaveLength.addEventListener('input', updateSineWaveLengthValue);
    if (sineWaveAmplitude) sineWaveAmplitude.addEventListener('input', updateSineWaveAmplitudeValue);
    if (sineWaveThickness) sineWaveThickness.addEventListener('input', updateSineWaveThicknessValue);
    if (sineWaveRotation) sineWaveRotation.addEventListener('input', updateSineWaveRotationValue);
    if (sineWaveCount) sineWaveCount.addEventListener('input', updateSineWaveCountValue);
    if (sineWaveDistance) sineWaveDistance.addEventListener('input', updateSineWaveDistanceValue);

    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleColorModeChange() {
        updateColorPickerVisibility();
        processImage();
    }
    
    function updateColorPickerVisibility() {
        // Get the hue control container by ID
        const hueControl = document.getElementById('hueControlItem');
        const saturationControl = document.querySelector('.control-item:has(input#saturation)');
        
        if (colorMode.value === 'custom') {
            customColorPickers.classList.add('active');
            // Hide HUE and saturation sliders in custom color mode
            if (hueControl) hueControl.style.display = 'none';
            if (saturationControl) saturationControl.style.display = 'none';
        } else {
            customColorPickers.classList.remove('active');
        }
        
        if (colorMode.value === 'multicolor') {
            multiColorPickers.classList.add('active');
            // Show HUE slider in multicolor mode
            if (hueControl) hueControl.style.display = 'block';
            // Hide saturation slider in multicolor mode
            if (saturationControl) saturationControl.style.display = 'none';
        } else {
            multiColorPickers.classList.remove('active');
        }
        
        // Handle visibility based on color mode
        if (colorMode.value === 'bw') {
            // Hide HUE and saturation sliders in B&W mode
            if (hueControl) hueControl.style.display = 'none';
            if (saturationControl) saturationControl.style.display = 'none';
        } else if (colorMode.value === 'rgb' || colorMode.value === 'cmyk') {
            // Show HUE and saturation sliders in rgb and cmyk modes
            if (hueControl) hueControl.style.display = 'block';
            if (saturationControl) saturationControl.style.display = 'block';
        }
    }

    function togglePreviewMode(mode) {
        if (currentPreviewMode === mode) return;
        
        // If trying to switch to SVG but dithering is disabled, show notification and return
        if (mode === 'svg' && ditherToggle && !ditherToggle.checked) {
            showNotification('SVG preview requires dithering to be enabled', true);
            return;
        }
        
        // Update toggle buttons
        if (mode === 'svg') {
            svgToggle.classList.add('active');
            pngToggle.classList.remove('active');
        } else {
            pngToggle.classList.add('active');
            svgToggle.classList.remove('active');
        }
        
        currentPreviewMode = mode;
        applyPreviewMode();
    }
    
    function applyPreviewMode() {
        // Update toggle buttons
        if (currentPreviewMode === 'svg') {
            svgToggle.classList.add('active');
            pngToggle.classList.remove('active');
            
            if (originalImage) {
                outputCanvas.style.display = 'none';
                updateSvgPreview();
                svgPreview.classList.add('active');
            }
        } else {
            pngToggle.classList.add('active');
            svgToggle.classList.remove('active');
            
            svgPreview.classList.remove('active');
            if (originalImage) {
                outputCanvas.style.display = 'block';
            }
        }
    }

    function updateSvgPreview() {
        // Clear the SVG preview
        svgPreview.innerHTML = '';
        
        // Generate the appropriate SVG content
        let svgContent = '';
        if (colorMode.value === 'bw' || colorMode.value === 'custom') {
            svgContent = generateBWSvg();
        } else {
            svgContent = generateColorSvg();
        }
        
        // Add the SVG to the preview
        svgPreview.innerHTML = svgContent;
        
        // Get the SVG element
        const svgElement = svgPreview.querySelector('svg');
        if (svgElement) {
            // Make sure the SVG has proper dimensions
            svgElement.setAttribute('width', outputCanvas.width);
            svgElement.setAttribute('height', outputCanvas.height);
            
            // Apply zoom and translation transforms
            svgElement.style.transform = `scale(${zoom}) translate(${offsetX / zoom}px, ${offsetY / zoom}px)`;
        }
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFiles(files);
        }
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        
        if (files.length > 0) {
            handleFiles(files);
        }
    }

    function handleFiles(files) {
        const file = files[0];
        
        if (!file.type.match('image.*')) {
            showNotification('Please upload an image file', true);
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                originalImage = img;
                // Hide the drop zone message and show the canvas or SVG depending on current mode
                dropZoneMessage.classList.add('hidden');
                
                if (currentPreviewMode === 'png') {
                    outputCanvas.style.display = 'block';
                    svgPreview.classList.remove('active');
                } else {
                    outputCanvas.style.display = 'none';
                    svgPreview.classList.add('active');
                }
                
                resetTransform();
                processImage();
            }
            img.src = e.target.result;
        }
        
        reader.readAsDataURL(file);
    }

    function processImage() {
        if (!originalImage) return;
        
        // Clear any existing timeout to prevent rapid processing
        if (processingTimeout) {
            clearTimeout(processingTimeout);
        }

        // Show loading overlay for heavy processing
        loadingOverlay.classList.add('active');

        // Use a timeout to ensure the UI updates before processing starts
        processingTimeout = setTimeout(() => {
            try {
                // Get the original dimensions without limiting to 1000px
                let width = originalImage.width;
                let height = originalImage.height;
                
                // Set fixed display dimensions
                const displayWidth = width;
                const displayHeight = height;
                
                // Apply resolution scaling based on slider value
                const resolutionScale = parseInt(blockSize.value) / 100;
                // Calculate processing dimensions based on scale
                let processingWidth, processingHeight;
                
                if (resolutionScale <= 1) {
                    // Downscaling (original behavior)
                    processingWidth = Math.max(4, Math.floor(width * resolutionScale));
                    processingHeight = Math.max(4, Math.floor(height * resolutionScale));
                } else {
                    // Upscaling (new behavior)
                    processingWidth = Math.floor(width * resolutionScale);
                    processingHeight = Math.floor(height * resolutionScale);
                }
                
                // Check if Extra Crush is enabled
                const isExtraCrush = document.getElementById('extraCrush').checked;
                
                if (isExtraCrush) {
                    // Apply the glitch effect by distorting dimensions in unusual ways
                    // This creates intentional artifacts
                    processingWidth = Math.floor(processingWidth * 1.5);
                    processingHeight = Math.max(4, Math.floor(processingHeight * 0.8));
                }
                
                // Create a temporary canvas for the original image at processing resolution
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = processingWidth;
                tempCanvas.height = processingHeight;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.imageSmoothingQuality = 'high';
                tempCtx.drawImage(originalImage, 0, 0, processingWidth, processingHeight);

                // Get the image data for processing
                const imageData = tempCtx.getImageData(0, 0, processingWidth, processingHeight);

                // Apply pre-processing
                applyPreProcessing(imageData);

                // Apply additional processing for Extra Crush
                if (isExtraCrush) {
                    // Introduce some intentional distortion in the color channels
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        // Shift color channels slightly
                        if (i + 8 < imageData.data.length) {
                            imageData.data[i] = imageData.data[i + 4]; // Shift red
                            imageData.data[i + 2] = imageData.data[i + 8]; // Shift blue
                        }
                        
                        // Add some quantization/posterization
                        imageData.data[i] = Math.floor(imageData.data[i] / 40) * 40;
                        imageData.data[i + 1] = Math.floor(imageData.data[i + 1] / 40) * 40;
                        imageData.data[i + 2] = Math.floor(imageData.data[i + 2] / 40) * 40;
                    }
                }
                
                // Apply pixel sort if enabled
                if (pixelSortToggle && pixelSortToggle.checked) {
                    const direction = currentSortDirection;
                    const sortThreshold = parseInt(pixelSortThreshold.value);
                    const sortAmount = parseInt(pixelSortAmount.value) / 100;
                    
                    applyPixelSort(imageData, direction, sortThreshold, sortAmount, processingWidth, processingHeight);
                }
                
                // Apply JPEG artifacts if enabled
                if (jpegGlitchToggle && jpegGlitchToggle.checked) {
                    const blockSizeValue = parseInt(jpegBlockSize.value);
                    const quantizationValue = parseInt(jpegQuantization.value);
                    const noiseValue = parseInt(jpegFreqNoise.value);
                    const modeValue = jpegMode.value;
                    
                    applyJpegArtifacts(imageData, blockSizeValue, quantizationValue, noiseValue, modeValue, processingWidth, processingHeight);
                }

                // Set canvas to display dimensions, not processing dimensions
                outputCanvas.width = displayWidth;
                outputCanvas.height = displayHeight;
                outputCtx.clearRect(0, 0, displayWidth, displayHeight);
                
                // Factor to scale from processing size to display size
                const pixelWidth = displayWidth / processingWidth;
                const pixelHeight = displayHeight / processingHeight;
                
                // Create a dithered result canvas at processing resolution
                const processedCanvas = document.createElement('canvas');
                processedCanvas.width = processingWidth;
                processedCanvas.height = processingHeight;
                const processedCtx = processedCanvas.getContext('2d');
                
                // Check if dithering is enabled
                const isDitheringEnabled = ditherToggle ? ditherToggle.checked : true;
                
                if (isDitheringEnabled) {
                    // Process by color mode with dithering
                    const colorModeValue = colorMode.value;
                    const thresholdValue = parseInt(threshold.value);
                    const ditherStrength = parseInt(ditherAmount.value) / 100;
                    
                    // Process by color mode
                    if (colorModeValue === 'bw' || colorModeValue === 'custom') {
                        // Apply black and white or custom color dithering
                        const ditherFunc = getDitherFunction(algorithm.value);
                        const result = ditherFunc(imageData, thresholdValue, ditherStrength);
                        
                        // Draw the dithered result to the processed canvas
                        const processedImageData = processedCtx.createImageData(processingWidth, processingHeight);
                        
                        // Get custom colors if needed
                        const useCustomColors = colorModeValue === 'custom';
                        let foregroundColor = useCustomColors ? hexToRgb(fgColor.value) : {r: 0, g: 0, b: 0};
                        let backgroundColor = useCustomColors ? hexToRgb(bgColor.value) : {r: 255, g: 255, b: 255};
                        
                        // Check if transparency is enabled
                        const useTransparentBg = useCustomColors && transparentBg.checked;
                        
                        // Apply color inversion if enabled
                        if (isInverted) {
                            // Swap foreground and background colors
                            const temp = foregroundColor;
                            foregroundColor = backgroundColor;
                            backgroundColor = temp;
                        }
                        
                        // Fill the processed image data with the dithered result
                        for (let y = 0; y < processingHeight; y++) {
                            for (let x = 0; x < processingWidth; x++) {
                                const i = (y * processingWidth + x);
                                const idx = i * 4;
                                
                                if (result[i] === 0) { // Foreground color
                                    processedImageData.data[idx] = foregroundColor.r;
                                    processedImageData.data[idx + 1] = foregroundColor.g;
                                    processedImageData.data[idx + 2] = foregroundColor.b;
                                } else { // Background color
                                    processedImageData.data[idx] = backgroundColor.r;
                                    processedImageData.data[idx + 1] = backgroundColor.g;
                                    processedImageData.data[idx + 2] = backgroundColor.b;
                                }
                                processedImageData.data[idx + 3] = (useTransparentBg && result[i] !== 0) ? 0 : 255; // Transparent if background and transparency enabled
                            }
                        }
                        
                        // Put the processed image data onto the processed canvas
                        processedCtx.putImageData(processedImageData, 0, 0);
                        
                    } else if (colorModeValue === 'multicolor') {
                        // Apply multi-color dithering
                        ditherMultiColor(imageData, algorithm.value, thresholdValue, ditherStrength, processedCtx);
                        
                        // Apply inversion if needed
                        if (isInverted) {
                            const invertedData = processedCtx.getImageData(0, 0, processingWidth, processingHeight);
                            for (let i = 0; i < invertedData.data.length; i += 4) {
                                invertedData.data[i] = 255 - invertedData.data[i];         // R
                                invertedData.data[i + 1] = 255 - invertedData.data[i + 1]; // G
                                invertedData.data[i + 2] = 255 - invertedData.data[i + 2]; // B
                            }
                            processedCtx.putImageData(invertedData, 0, 0);
                        }
                        
                    } else if (colorModeValue === 'rgb') {
                        // Apply RGB color dithering
                        ditherColorRGB(imageData, algorithm.value, thresholdValue, ditherStrength, processedCtx);
                        
                        // Apply inversion if needed
                        if (isInverted) {
                            const invertedData = processedCtx.getImageData(0, 0, processingWidth, processingHeight);
                            for (let i = 0; i < invertedData.data.length; i += 4) {
                                invertedData.data[i] = 255 - invertedData.data[i];         // R
                                invertedData.data[i + 1] = 255 - invertedData.data[i + 1]; // G
                                invertedData.data[i + 2] = 255 - invertedData.data[i + 2]; // B
                            }
                            processedCtx.putImageData(invertedData, 0, 0);
                        }
                        
                    } else if (colorModeValue === 'cmyk') {
                        // Apply CMYK-like color dithering
                        ditherColorCMYK(imageData, algorithm.value, thresholdValue, ditherStrength, processedCtx);
                        
                        // Apply inversion if needed
                        if (isInverted) {
                            const invertedData = processedCtx.getImageData(0, 0, processingWidth, processingHeight);
                            for (let i = 0; i < invertedData.data.length; i += 4) {
                                invertedData.data[i] = 255 - invertedData.data[i];         // R
                                invertedData.data[i + 1] = 255 - invertedData.data[i + 1]; // G
                                invertedData.data[i + 2] = 255 - invertedData.data[i + 2]; // B
                            }
                            processedCtx.putImageData(invertedData, 0, 0);
                        }
                    }
                } else {
                    // Skip dithering, just put the preprocessed image data on the canvas
                    processedCtx.putImageData(imageData, 0, 0);
                }
                
                // Draw the processed canvas to the display canvas with nearest-neighbor scaling
                outputCtx.imageSmoothingEnabled = false; // Disable anti-aliasing for sharp pixels
                outputCtx.drawImage(processedCanvas, 0, 0, displayWidth, displayHeight);
                
                // Store the processed canvas for SVG generation
                window.processedCanvas = processedCanvas;

                // Update SVG preview if in SVG mode
                if (currentPreviewMode === 'svg') {
                    updateSvgPreview();
                }

                loadingOverlay.classList.remove('active');
            } catch (error) {
                console.error('Error processing image:', error);
                showNotification('Error processing image: ' + error.message, true);
                loadingOverlay.classList.remove('active');
            }
        }, 50);
    }

    // Helper function to convert hex to RGB
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse the hex values
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        
        return { r, g, b };
    }

    function ditherColorRGB(imageData, algorithmName, threshold, strength, ctx) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Apply dithering to each channel separately
        const redChannel = new Uint8ClampedArray(width * height * 4);
        const greenChannel = new Uint8ClampedArray(width * height * 4);
        const blueChannel = new Uint8ClampedArray(width * height * 4);
        
        // Extract channels
        for (let i = 0; i < data.length; i += 4) {
            redChannel[i] = data[i];
            redChannel[i + 1] = data[i];
            redChannel[i + 2] = data[i];
            redChannel[i + 3] = 255;
            
            greenChannel[i] = data[i + 1];
            greenChannel[i + 1] = data[i + 1];
            greenChannel[i + 2] = data[i + 1];
            greenChannel[i + 3] = 255;
            
            blueChannel[i] = data[i + 2];
            blueChannel[i + 1] = data[i + 2];
            blueChannel[i + 2] = data[i + 2];
            blueChannel[i + 3] = 255;
        }
        
        // Create separate ImageData objects for each channel
        const redImage = new ImageData(redChannel, width, height);
        const greenImage = new ImageData(greenChannel, width, height);
        const blueImage = new ImageData(blueChannel, width, height);
        
        // Get the dither function
        const ditherFunc = getDitherFunction(algorithmName);
        
        // Apply dithering to each channel
        const redResult = ditherFunc(redImage, threshold, strength);
        const greenResult = ditherFunc(greenImage, threshold, strength);
        const blueResult = ditherFunc(blueImage, threshold, strength);
        
        // Create a new ImageData for the result
        const resultImageData = ctx.createImageData(width, height);
        
        // Combine the dithered channels
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const idx = i * 4;
                
                // Get dithered values for each channel
                const r = redResult[i] === 0 ? 0 : 255;
                const g = greenResult[i] === 0 ? 0 : 255;
                const b = blueResult[i] === 0 ? 0 : 255;
                
                resultImageData.data[idx] = r;
                resultImageData.data[idx + 1] = g;
                resultImageData.data[idx + 2] = b;
                resultImageData.data[idx + 3] = 255; // Alpha
            }
        }
        
        // Put the result onto the canvas
        ctx.putImageData(resultImageData, 0, 0);
    }

    function ditherColorCMYK(imageData, algorithmName, threshold, strength, ctx) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Convert RGB to CMYK
        const cyanChannel = new Uint8ClampedArray(width * height * 4);
        const magentaChannel = new Uint8ClampedArray(width * height * 4);
        const yellowChannel = new Uint8ClampedArray(width * height * 4);
        const blackChannel = new Uint8ClampedArray(width * height * 4);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;
            
            const k = 1 - Math.max(r, g, b);
            const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
            const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
            const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
            
            cyanChannel[i] = Math.round(c * 255);
            cyanChannel[i + 1] = cyanChannel[i];
            cyanChannel[i + 2] = cyanChannel[i];
            cyanChannel[i + 3] = 255;
            
            magentaChannel[i] = Math.round(m * 255);
            magentaChannel[i + 1] = magentaChannel[i];
            magentaChannel[i + 2] = magentaChannel[i];
            magentaChannel[i + 3] = 255;
            
            yellowChannel[i] = Math.round(y * 255);
            yellowChannel[i + 1] = yellowChannel[i];
            yellowChannel[i + 2] = yellowChannel[i];
            yellowChannel[i + 3] = 255;
            
            blackChannel[i] = Math.round(k * 255);
            blackChannel[i + 1] = blackChannel[i];
            blackChannel[i + 2] = blackChannel[i];
            blackChannel[i + 3] = 255;
        }
        
        // Create separate ImageData objects for each channel
        const cyanImage = new ImageData(cyanChannel, width, height);
        const magentaImage = new ImageData(magentaChannel, width, height);
        const yellowImage = new ImageData(yellowChannel, width, height);
        const blackImage = new ImageData(blackChannel, width, height);
        
        // Get the dither function
        const ditherFunc = getDitherFunction(algorithmName);
        
        // Apply dithering to each channel
        const cyanResult = ditherFunc(cyanImage, threshold, strength);
        const magentaResult = ditherFunc(magentaImage, threshold, strength);
        const yellowResult = ditherFunc(yellowImage, threshold, strength);
        const blackResult = ditherFunc(blackImage, threshold, strength);
        
        // Create a new ImageData for the result
        const resultImageData = ctx.createImageData(width, height);
        
        // Combine the dithered channels
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const idx = i * 4;
                
                // CMYK are subtractive colors, so 0 means no ink (white paper)
                // and 255 means full ink coverage
                const c = cyanResult[i] === 0 ? 0 : 1;
                const m = magentaResult[i] === 0 ? 0 : 1;
                const yl = yellowResult[i] === 0 ? 0 : 1;
                const k = blackResult[i] === 0 ? 0 : 1;
                
                // Convert back to RGB (simplified conversion)
                const r = Math.round(255 * (1 - c) * (1 - k));
                const g = Math.round(255 * (1 - m) * (1 - k));
                const b = Math.round(255 * (1 - yl) * (1 - k));
                
                resultImageData.data[idx] = r;
                resultImageData.data[idx + 1] = g;
                resultImageData.data[idx + 2] = b;
                resultImageData.data[idx + 3] = 255; // Alpha
            }
        }
        
        // Put the result onto the canvas
        ctx.putImageData(resultImageData, 0, 0);
    }

    function generateBWSvg() {
        // Use the processed canvas for SVG generation
        const processedCanvas = window.processedCanvas;
        if (!processedCanvas) return '';
        
        const processingWidth = processedCanvas.width;
        const processingHeight = processedCanvas.height;
        const processedCtx = processedCanvas.getContext('2d');
        const processedData = processedCtx.getImageData(0, 0, processingWidth, processingHeight).data;
        
        // Get custom colors if in custom mode
        const useCustomColors = colorMode.value === 'custom';
        const foregroundColor = useCustomColors ? fgColor.value : 'black';
        const backgroundColor = useCustomColors ? bgColor.value : 'white';
        
        // Check if transparency is enabled
        const useTransparentBg = useCustomColors && transparentBg.checked;
        
        // Original dimensions for SVG viewBox
        const width = outputCanvas.width;
        const height = outputCanvas.height;
        
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
        
        // Add background rectangle only if not using transparency
        if (!useTransparentBg) {
            svg += `  <rect width="${width}" height="${height}" fill="${backgroundColor}"/>\n`;
        }
        
        // Start a path for all foreground pixels
        svg += `  <path d="`;
        
        // Calculate pixel size in SVG coordinates
        const pixelWidth = width / processingWidth;
        const pixelHeight = height / processingHeight;
        
        // Create rectangles for each pixel
        for (let y = 0; y < processingHeight; y++) {
            for (let x = 0; x < processingWidth; x++) {
                const i = (y * processingWidth + x) * 4;
                
                // Check if the pixel is foreground color
                if (isPixelForeground(processedData[i], processedData[i+1], processedData[i+2], useCustomColors)) {
                    // Create rectangle for this pixel
                    const px = x * pixelWidth;
                    const py = y * pixelHeight;
                    svg += `M${px},${py}h${pixelWidth}v${pixelHeight}h-${pixelWidth}z `;
                }
            }
        }
        
        svg += `" fill="${foregroundColor}"/>\n`;
        svg += '</svg>';
        
        return svg;
    }

    // Function to check if a pixel is foreground in custom color mode
    function isPixelForeground(r, g, b, useCustomColors) {
        if (useCustomColors) {
            const fgRgb = hexToRgb(fgColor.value);
            const bgRgb = hexToRgb(bgColor.value);
            
            // Check if the pixel is closer to foreground than background
            const distToFg = colorDistance(r, g, b, fgRgb.r, fgRgb.g, fgRgb.b);
            const distToBg = colorDistance(r, g, b, bgRgb.r, bgRgb.g, bgRgb.b);
            
            return distToFg < distToBg;
        } else {
            // For B&W, dark pixels are foreground
            return r < 128 && g < 128 && b < 128;
        }
    }

    // Calculate the distance between two colors
    function colorDistance(r1, g1, b1, r2, g2, b2) {
        return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    }

    function applyPreProcessing(imageData) {
        const contrastFactor = 1 + parseInt(contrast.value) / 100;
        const brightnessFactor = parseInt(brightness.value);
        const saturationFactor = 1 + parseInt(saturation.value) / 100;
        const blurRadius = parseFloat(blur.value);
        const hueRotation = parseInt(hue.value);
        
        // Get levels values
        const blackPointValue = parseInt(blackPoint.value);
        const midPointValue = parseInt(midPoint.value);
        const whitePointValue = parseInt(whitePoint.value);
        
        // Calculate levels normalization factors
        const levelsRange = whitePointValue - blackPointValue;
        const levelsGamma = 1 / (midPointValue / 128);

        // Apply blur if needed
        if (blurRadius > 0) {
            applyGaussianBlur(imageData, blurRadius);
        }

        // Apply saturation independently if needed
        if (saturationFactor !== 1) {
            // Create a copy of the image data with just saturation applied
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                // Convert RGB to HSL
                const r = data[i] / 255;
                const g = data[i + 1] / 255;
                const b = data[i + 2] / 255;
                
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                let h, s, l = (max + min) / 2;
                
                if (max === min) {
                    h = s = 0; // achromatic
                } else {
                    const d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    
                    h = h / 6;
                }
                
                // Apply saturation adjustment
                s = Math.min(1, Math.max(0, s * saturationFactor));
                
                // Convert HSL back to RGB
                let r1, g1, b1;
                
                if (s === 0) {
                    r1 = g1 = b1 = l; // achromatic
                } else {
                    const hue2rgb = (p, q, t) => {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1/6) return p + (q - p) * 6 * t;
                        if (t < 1/2) return q;
                        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    };
                    
                    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    const p = 2 * l - q;
                    
                    r1 = hue2rgb(p, q, h + 1/3);
                    g1 = hue2rgb(p, q, h);
                    b1 = hue2rgb(p, q, h - 1/3);
                }
                
                // Store the result
                data[i] = Math.round(r1 * 255);
                data[i + 1] = Math.round(g1 * 255);
                data[i + 2] = Math.round(b1 * 255);
            }
        }

        // Apply hue rotation if needed
        if (hueRotation > 0) {
            applyHueRotation(imageData, hueRotation);
        }

        // Apply levels adjustment, brightness, and contrast
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Apply levels to each channel
            for (let j = 0; j < 3; j++) {
                const channel = i + j;
                
                // Apply levels adjustment - clamp to input range, normalize, apply gamma, scale to output range
                let pixelValue = imageData.data[channel];
                
                // Map through the levels transformation
                if (levelsRange > 0) {
                    // Clamp to input levels range and normalize to 0-1
                    pixelValue = Math.max(0, pixelValue - blackPointValue) / levelsRange;
                    
                    // Apply gamma correction for midtones
                    pixelValue = Math.pow(pixelValue, levelsGamma);
                    
                    // Scale back to 0-255
                    pixelValue = pixelValue * 255;
                }
                
                // Apply brightness
                pixelValue += brightnessFactor;
                
                // Apply contrast (adjust around midpoint 128)
                pixelValue = 128 + (pixelValue - 128) * contrastFactor;
                
                // Clamp to valid range
                imageData.data[channel] = Math.min(255, Math.max(0, pixelValue));
            }
        }
    }

    // Helper function to apply hue rotation to an image
    function applyHueRotation(imageData, hueRotation) {
        const data = imageData.data;
        // Don't apply saturation here since we've already done it separately
        
        for (let i = 0; i < data.length; i += 4) {
            // Convert RGB to HSL
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                
                h = h / 6;
            }
            
            // Apply hue rotation
            h = (h + hueRotation / 360) % 1;
            
            // Don't modify saturation here since we're handling it separately
            
            // Convert HSL back to RGB
            let r1, g1, b1;
            
            if (s === 0) {
                r1 = g1 = b1 = l; // achromatic
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                
                r1 = hue2rgb(p, q, h + 1/3);
                g1 = hue2rgb(p, q, h);
                b1 = hue2rgb(p, q, h - 1/3);
            }
            
            // Store the result
            data[i] = Math.round(r1 * 255);
            data[i + 1] = Math.round(g1 * 255);
            data[i + 2] = Math.round(b1 * 255);
        }
    }

    function applyGaussianBlur(imageData, radius) {
        // Simple box blur as an approximation for Gaussian blur
        // For better quality, a true Gaussian kernel would be used
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        
        tempCtx.putImageData(imageData, 0, 0);
        
        // Use built-in canvas blur
        tempCtx.filter = `blur(${radius}px)`;
        tempCtx.drawImage(tempCanvas, 0, 0);
        
        // Copy back the blurred image
        const blurredData = tempCtx.getImageData(0, 0, imageData.width, imageData.height);
        for (let i = 0; i < imageData.data.length; i++) {
            imageData.data[i] = blurredData.data[i];
        }
    }

    function getDitherFunction(algorithmName) {
        switch (algorithmName) {
            case 'floydSteinberg': return floydSteinbergDither;
            case 'atkinson': return atkinsonDither;
            case 'bayer': return bayer8Dither;
            case 'bayer4': return bayer4Dither;
            case 'bayer2': return bayer2Dither;
            case 'threshold': return thresholdDither;
            case 'random': return randomDither;
            case 'burkes': return burkesDither;
            case 'sierra': return sierraDither;
            case 'sierra2': return sierra2RowDither;
            case 'sierraLite': return sierraLiteDither;
            case 'stucki': return stuckiDither;
            case 'jarvis': return jarvisDither;
            case 'halftone': return halftoneDither;
            // New algorithms
            case 'bitTone': return bitToneDither;
            case 'checkerSmall': return checkerDither;
            case 'radialBurst': return radialBurstDither;
            case 'vortex': return vortexDither;
            case 'diamond': return diamondDither;
            case 'wave': return waveDither;
            case 'gridlock': return gridlockDither;
            case 'mosaic': return mosaicDither;
            case 'sineWave': return sineWaveDither;
            case 'hModulation': return circuitGridDither;
            default: return floydSteinbergDither;
        }
    }

    function thresholdDither(imageData, threshold, strength) {
        const result = new Uint8ClampedArray(imageData.width * imageData.height);
        const data = imageData.data;
        
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const i = (y * imageData.width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                result[y * imageData.width + x] = gray < threshold ? 0 : 255;
            }
        }
        
        return result;
    }

    function randomDither(imageData, threshold, strength) {
        const result = new Uint8ClampedArray(imageData.width * imageData.height);
        const data = imageData.data;
        
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const i = (y * imageData.width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                const noise = (Math.random() - 0.5) * 256 * strength;
                result[y * imageData.width + x] = (gray + noise) < threshold ? 0 : 255;
            }
        }
        
        return result;
    }

    function floydSteinbergDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Create a grayscale buffer
        const gray = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                gray[y * width + x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }
        }
        
        // Create the result buffer
        const result = new Uint8ClampedArray(width * height);
        
        // Apply Floyd-Steinberg dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const oldPixel = gray[i];
                const newPixel = oldPixel < threshold ? 0 : 255;
                result[i] = newPixel;
                
                const error = (oldPixel - newPixel) * strength;
                
                if (x + 1 < width)
                    gray[i + 1] += error * 7 / 16;
                if (y + 1 < height) {
                    if (x - 1 >= 0)
                        gray[i + width - 1] += error * 3 / 16;
                    gray[i + width] += error * 5 / 16;
                    if (x + 1 < width)
                        gray[i + width + 1] += error * 1 / 16;
                }
            }
        }
        
        return result;
    }

    function atkinsonDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Create a grayscale buffer
        const gray = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                gray[y * width + x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }
        }
        
        // Create the result buffer
        const result = new Uint8ClampedArray(width * height);
        
        // Apply Atkinson dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const oldPixel = gray[i];
                const newPixel = oldPixel < threshold ? 0 : 255;
                result[i] = newPixel;
                
                const error = (oldPixel - newPixel) * strength / 8;
                
                if (x + 1 < width)
                    gray[i + 1] += error;
                if (x + 2 < width)
                    gray[i + 2] += error;
                if (y + 1 < height) {
                    if (x - 1 >= 0)
                        gray[i + width - 1] += error;
                    gray[i + width] += error;
                    if (x + 1 < width)
                        gray[i + width + 1] += error;
                }
                if (y + 2 < height)
                    gray[i + width * 2] += error;
            }
        }
        
        return result;
    }

    function generateBayerMatrix(n) {
        if (n === 2) {
            return [
                [0, 2],
                [3, 1]
            ];
        }
        
        // Generate larger Bayer matrix recursively
        const previousMatrix = generateBayerMatrix(n / 2);
        const size = n;
        const matrix = Array(size).fill().map(() => Array(size).fill(0));
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                // Calculate the quadrant
                const qx = Math.floor(x / (size / 2));
                const qy = Math.floor(y / (size / 2));
                
                // Calculate position within the quadrant
                const px = x % (size / 2);
                const py = y % (size / 2);
                
                // Calculate the value
                let value = previousMatrix[py][px] * 4;
                if (qx === 0 && qy === 0) value += 0;
                else if (qx === 1 && qy === 0) value += 2;
                else if (qx === 0 && qy === 1) value += 3;
                else if (qx === 1 && qy === 1) value += 1;
                
                matrix[y][x] = value;
            }
        }
        
        return matrix;
    }

    // Generate Bayer matrices
    const bayer2Matrix = generateBayerMatrix(2);
    const bayer4Matrix = generateBayerMatrix(4);
    const bayer8Matrix = generateBayerMatrix(8);

    function bayer2Dither(imageData, threshold, strength) {
        return orderedDither(imageData, bayer2Matrix, threshold, strength);
    }

    function bayer4Dither(imageData, threshold, strength) {
        return orderedDither(imageData, bayer4Matrix, threshold, strength);
    }

    function bayer8Dither(imageData, threshold, strength) {
        return orderedDither(imageData, bayer8Matrix, threshold, strength);
    }

    function orderedDither(imageData, matrix, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const matrixSize = matrix.length;
        
        // Create the result buffer
        const result = new Uint8ClampedArray(width * height);
        
        // Apply ordered dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                
                // Get the threshold from the matrix
                const mx = x % matrixSize;
                const my = y % matrixSize;
                const matrixValue = matrix[my][mx] / (matrixSize * matrixSize);
                
                // Apply the matrix threshold
                const normalizedThreshold = threshold / 255;
                const adjustedThreshold = (normalizedThreshold + (matrixValue - 0.5) * strength) * 255;
                
                result[y * width + x] = gray < adjustedThreshold ? 0 : 255;
            }
        }
        
        return result;
    }

    function burkesDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Create a grayscale buffer
        const gray = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                gray[y * width + x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }
        }
        
        // Create the result buffer
        const result = new Uint8ClampedArray(width * height);
        
        // Apply Burkes dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const oldPixel = gray[i];
                const newPixel = oldPixel < threshold ? 0 : 255;
                result[i] = newPixel;
                
                const error = (oldPixel - newPixel) * strength / 32;
                
                if (x + 1 < width) gray[i + 1] += error * 8;
                if (x + 2 < width) gray[i + 2] += error * 4;
                
                if (y + 1 < height) {
                    if (x - 2 >= 0) gray[i + width - 2] += error * 2;
                    if (x - 1 >= 0) gray[i + width - 1] += error * 4;
                    gray[i + width] += error * 8;
                    if (x + 1 < width) gray[i + width + 1] += error * 4;
                    if (x + 2 < width) gray[i + width + 2] += error * 2;
                }
            }
        }
        
        return result;
    }

    function sierraDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Create a grayscale buffer
        const gray = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                gray[y * width + x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }
        }
        
        // Create the result buffer
        const result = new Uint8ClampedArray(width * height);
        
        // Apply Sierra dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const oldPixel = gray[i];
                const newPixel = oldPixel < threshold ? 0 : 255;
                result[i] = newPixel;
                
                const error = (oldPixel - newPixel) * strength / 32;
                
                if (x + 1 < width) gray[i + 1] += error * 5;
                if (x + 2 < width) gray[i + 2] += error * 3;
                
                if (y + 1 < height) {
                    if (x - 2 >= 0) gray[i + width - 2] += error * 2;
                    if (x - 1 >= 0) gray[i + width - 1] += error * 4;
                    gray[i + width] += error * 5;
                    if (x + 1 < width) gray[i + width + 1] += error * 4;
                    if (x + 2 < width) gray[i + width + 2] += error * 2;
                }
                
                if (y + 2 < height) {
                    if (x - 1 >= 0) gray[i + width * 2 - 1] += error * 2;
                    gray[i + width * 2] += error * 3;
                    if (x + 1 < width) gray[i + width * 2 + 1] += error * 2;
                }
            }
        }
        
        return result;
    }

    function sierra2RowDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Create a grayscale buffer
        const gray = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                gray[y * width + x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }
        }
        
        // Create the result buffer
        const result = new Uint8ClampedArray(width * height);
        
        // Apply Sierra Two-Row dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const oldPixel = gray[i];
                const newPixel = oldPixel < threshold ? 0 : 255;
                result[i] = newPixel;
                
                const error = (oldPixel - newPixel) * strength / 16;
                
                if (x + 1 < width) gray[i + 1] += error * 4;
                if (x + 2 < width) gray[i + 2] += error * 3;
                
                if (y + 1 < height) {
                    if (x - 2 >= 0) gray[i + width - 2] += error * 1;
                    if (x - 1 >= 0) gray[i + width - 1] += error * 2;
                    gray[i + width] += error * 3;
                    if (x + 1 < width) gray[i + width + 1] += error * 2;
                    if (x + 2 < width) gray[i + width + 2] += error * 1;
                }
            }
        }
        
        return result;
    }

    function sierraLiteDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Create a grayscale buffer
        const gray = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                gray[y * width + x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }
        }
        
        // Create the result buffer
        const result = new Uint8ClampedArray(width * height);
        
        // Apply Sierra Lite dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const oldPixel = gray[i];
                const newPixel = oldPixel < threshold ? 0 : 255;
                result[i] = newPixel;
                
                const error = (oldPixel - newPixel) * strength / 4;
                
                if (x + 1 < width) gray[i + 1] += error * 2;
                
                if (y + 1 < height) {
                    if (x - 1 >= 0) gray[i + width - 1] += error * 1;
                    gray[i + width] += error * 1;
                }
            }
        }
        
        return result;
    }

    function stuckiDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Create a grayscale buffer
        const gray = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                gray[y * width + x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }
        }
        
        // Create the result buffer
        const result = new Uint8ClampedArray(width * height);
        
        // Apply Stucki dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const oldPixel = gray[i];
                const newPixel = oldPixel < threshold ? 0 : 255;
                result[i] = newPixel;
                
                const error = (oldPixel - newPixel) * strength / 42;
                
                if (x + 1 < width) gray[i + 1] += error * 8;
                if (x + 2 < width) gray[i + 2] += error * 4;
                
                if (y + 1 < height) {
                    if (x - 2 >= 0) gray[i + width - 2] += error * 2;
                    if (x - 1 >= 0) gray[i + width - 1] += error * 4;
                    gray[i + width] += error * 8;
                    if (x + 1 < width) gray[i + width + 1] += error * 4;
                    if (x + 2 < width) gray[i + width + 2] += error * 2;
                }
                
                if (y + 2 < height) {
                    if (x - 2 >= 0) gray[i + width * 2 - 2] += error * 1;
                    if (x - 1 >= 0) gray[i + width * 2 - 1] += error * 2;
                    gray[i + width * 2] += error * 4;
                    if (x + 1 < width) gray[i + width * 2 + 1] += error * 2;
                    if (x + 2 < width) gray[i + width * 2 + 2] += error * 1;
                }
            }
        }
        
        return result;
    }

    function jarvisDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Create a grayscale buffer
        const gray = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                gray[y * width + x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }
        }
        
        // Create the result buffer
        const result = new Uint8ClampedArray(width * height);
        
        // Apply Jarvis-Judice-Ninke dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const oldPixel = gray[i];
                const newPixel = oldPixel < threshold ? 0 : 255;
                result[i] = newPixel;
                
                const error = (oldPixel - newPixel) * strength / 48;
                
                if (x + 1 < width) gray[i + 1] += error * 7;
                if (x + 2 < width) gray[i + 2] += error * 5;
                
                if (y + 1 < height) {
                    if (x - 2 >= 0) gray[i + width - 2] += error * 3;
                    if (x - 1 >= 0) gray[i + width - 1] += error * 5;
                    gray[i + width] += error * 7;
                    if (x + 1 < width) gray[i + width + 1] += error * 5;
                    if (x + 2 < width) gray[i + width + 2] += error * 3;
                }
                
                if (y + 2 < height) {
                    if (x - 2 >= 0) gray[i + width * 2 - 2] += error * 1;
                    if (x - 1 >= 0) gray[i + width * 2 - 1] += error * 3;
                    gray[i + width * 2] += error * 5;
                    if (x + 1 < width) gray[i + width * 2 + 1] += error * 3;
                    if (x + 2 < width) gray[i + width * 2 + 2] += error * 1;
                }
            }
        }
        
        return result;
    }

    // Halftone Dithering
    function halftoneDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Initialize with white
        for (let i = 0; i < width * height; i++) {
            result[i] = 255;
        }
        
        // Get the pattern size - enforce a minimum value to prevent crashes
        const cellSize = Math.max(2, parseFloat(patternSize?.value || 4));
        const angle = (parseInt(patternAngle?.value || 0) * Math.PI / 180);
        
        // Calculate the max radius with a margin to prevent dots from touching
        const maxRadius = Math.max(0.8, cellSize * 0.4);
        
        // For each cell in the grid - integer steps to avoid floating point issues
        const intCellSize = Math.max(1, Math.floor(cellSize));
        
        for (let cellY = 0; cellY < height; cellY += intCellSize) {
            for (let cellX = 0; cellX < width; cellX += intCellSize) {
                // Calculate average gray value for the cell
                let totalGray = 0;
                let count = 0;
                
                // Use safe bounds checking
                const cellEndY = Math.min(cellY + intCellSize, height);
                const cellEndX = Math.min(cellX + intCellSize, width);
                
                for (let y = cellY; y < cellEndY; y++) {
                    for (let x = cellX; x < cellEndX; x++) {
                        const i = (y * width + x) * 4;
                        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                        totalGray += gray;
                        count++;
                    }
                }
                
                // Skip if no pixels were processed (shouldn't happen with bounds checking)
                if (count === 0) continue;
                
                const avgGray = totalGray / count;
                
                // Invert the gray value so darker areas have larger dots
                const normalizedGray = 1 - (avgGray / 255);
                
                // Apply threshold - if below threshold, skip the dot entirely
                if (normalizedGray < threshold / 255 * 0.15) continue;
                
                // Calculate dot radius - use square root for more natural scaling
                // Limit the minimum dot size to prevent invisible dots
                const dotRadius = Math.max(0.5, maxRadius * Math.sqrt(normalizedGray));
                
                // Cell center coordinates
                const centerX = cellX + intCellSize / 2;
                const centerY = cellY + intCellSize / 2;
                
                // Only draw the dot if radius is positive and center is in bounds
                if (dotRadius > 0 && centerX >= 0 && centerX < width && centerY >= 0 && centerY < height) {
                    // Draw the circular dot
                    const radiusSquared = dotRadius * dotRadius;
                    const scanRadius = Math.ceil(dotRadius);
                    
                    // Limit scan area to prevent excessive iterations
                    const maxScan = Math.min(scanRadius, 50);
                    
                    for (let dy = -maxScan; dy <= maxScan; dy++) {
                        const y = Math.floor(centerY + dy);
                        if (y < 0 || y >= height) continue;
                        
                        for (let dx = -scanRadius; dx <= scanRadius; dx++) {
                            const x = Math.floor(centerX + dx);
                            if (x < 0 || x >= width) continue;
                            
                            // Check if the point is within the dot radius
                            // Use distance squared for efficiency
                            const distSquared = dx * dx + dy * dy;
                            if (distSquared <= radiusSquared) {
                                result[y * width + x] = 0; // Black
                            }
                        }
                    }
                }
            }
        }
        
        return result;
    }

    function drawScaledResult(result, width, height, pixelSize) {
        outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const value = result[y * width + x];
                outputCtx.fillStyle = value === 0 ? 'black' : 'white';
                outputCtx.fillRect(
                    x * pixelSize, 
                    y * pixelSize, 
                    pixelSize, 
                    pixelSize
                );
            }
        }
    }

    function drawScaledCustomColorResult(result, scale) {
        const scaledWidth = Math.floor(outputCanvas.width / scale);
        const scaledHeight = Math.floor(outputCanvas.height / scale);
        
        outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        // Get the custom foreground and background colors
        const foregroundColor = fgColor.value;
        const backgroundColor = bgColor.value;
        const useTransparentBg = transparentBg.checked;
        
        for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < scaledWidth; x++) {
                const value = result[y * scaledWidth + x];
                if (value === 0) {
                    outputCtx.fillStyle = foregroundColor;
                    outputCtx.fillRect(x * scale, y * scale, scale, scale);
                } else if (!useTransparentBg) {
                    outputCtx.fillStyle = backgroundColor;
                    outputCtx.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        }
    }

    function updateContrastValue() {
        contrastValue.value = contrast.value;
        processImageWithDelay();
    }

    function updateBrightnessValue() {
        brightnessValue.value = brightness.value;
        processImageWithDelay();
    }

    function updateSaturationValue() {
        saturationValue.value = saturation.value;
        processImageWithDelay();
    }

    function updateHueValue() {
        hueValue.value = hue.value + "°";
        processImageWithDelay();
    }
    
    function updateBlurValue() {
        blurValue.value = blur.value;
        processImageWithDelay();
    }
    
    function updateThresholdValue() {
        thresholdValue.value = threshold.value;
        processImageWithDelay();
    }

    function updateDitherAmountValue() {
        ditherAmountValue.value = ditherAmount.value;
        processImageWithDelay();
    }

    function updateBlockSizeValue() {
        const blockSizeVal = parseInt(blockSize.value);
        blockSizeValue.value = blockSizeVal + "%";
        
        // Show notification when upscaling is used
        if (blockSizeVal > 100 && originalImage) {
            showNotification('Upscaling to ' + blockSizeVal + '% - finer dithering pattern');
        }
        
        processImageWithDelay();
    }

    function updateBlackPointValue() {
        blackPointValue.value = blackPoint.value;
        // Ensure blackPoint <= midPoint <= whitePoint
        if (parseInt(blackPoint.value) >= parseInt(midPoint.value)) {
            midPoint.value = parseInt(blackPoint.value) + 1;
            midPointValue.value = midPoint.value;
        }
        processImageWithDelay();
    }
    
    function updateMidPointValue() {
        midPointValue.value = midPoint.value;
        // Ensure blackPoint <= midPoint <= whitePoint
        if (parseInt(midPoint.value) <= parseInt(blackPoint.value)) {
            blackPoint.value = parseInt(midPoint.value) - 1;
            blackPointValue.value = blackPoint.value;
        }
        if (parseInt(midPoint.value) >= parseInt(whitePoint.value)) {
            whitePoint.value = parseInt(midPoint.value) + 1;
            whitePointValue.value = whitePoint.value;
        }
        processImageWithDelay();
    }
    
    function updateWhitePointValue() {
        whitePointValue.value = whitePoint.value;
        // Ensure blackPoint <= midPoint <= whitePoint
        if (parseInt(whitePoint.value) <= parseInt(midPoint.value)) {
            midPoint.value = parseInt(whitePoint.value) - 1;
            midPointValue.value = midPoint.value;
        }
        processImageWithDelay();
    }
    
    // Helper function to debounce processing
    function processImageWithDelay() {
        if (processingTimeout) {
            clearTimeout(processingTimeout);
        }
        processingTimeout = setTimeout(processImage, 100);
    }

    function resetSettings() {
        // Reset all control values to default
        threshold.value = 128;
        thresholdValue.value = 128;
        ditherAmount.value = 75;
        ditherAmountValue.value = 75;
        contrast.value = 0;
        contrastValue.value = 0;
        brightness.value = 0;
        brightnessValue.value = 0;
        saturation.value = 0;
        saturationValue.value = 0;
        blur.value = 0;
        blurValue.value = 0;
        hue.value = 0;
        hueValue.value = '0°';
        blockSize.value = 100;
        blockSizeValue.value = '100%';
        blackPoint.value = 0;
        blackPointValue.value = 0;
        midPoint.value = 128;
        midPointValue.value = 128;
        whitePoint.value = 255;
        whitePointValue.value = 255;
        algorithm.value = 'floydSteinberg';
        colorMode.value = 'bw';
        
        // Reset custom colors
        fgColor.value = '#111';
        bgColor.value = '#9392D9';
        transparentBg.checked = false;
        bgColor.disabled = false;
        bgColor.parentElement.classList.remove('disabled');
        
        // Reset multi-color pickers
        const colorInputs = document.querySelectorAll('.multi-color');
        colorInputs[0].value = '#FF0000';
        colorInputs[1].value = '#00FF00';
        colorInputs[2].value = '#0000FF';
        
        // Reset bit tone control
        document.getElementById('bitDepth').value = 2;
        document.getElementById('bitDepthValue').value = 2;
        
        // Reset mosaic control
        document.getElementById('mosaicSize').value = 4;
        document.getElementById('mosaicSizeValue').value = 4;
        
        // Reset pattern controls
        document.getElementById('patternSize').value = 10;
        document.getElementById('patternSizeValue').value = 10;
        document.getElementById('patternAngle').value = 0;
        document.getElementById('patternAngleValue').value = '0°';

        // Reset wave controls
        document.getElementById('waveLength').value = 16;
        document.getElementById('waveLengthValue').value = 16;
        document.getElementById('waveAmplitude').value = 8;
        document.getElementById('waveAmplitudeValue').value = 8;
        
        // Reset Sine Wave controls
        document.getElementById('sineWaveLength').value = 55;
        document.getElementById('sineWaveLengthValue').value = 55;
        document.getElementById('sineWaveAmplitude').value = 15;
        document.getElementById('sineWaveAmplitudeValue').value = 15;
        document.getElementById('sineWaveThickness').value = 5;
        document.getElementById('sineWaveThicknessValue').value = 5;
        document.getElementById('sineWaveRotation').value = 90;
        document.getElementById('sineWaveRotationValue').value = '90°';
        document.getElementById('sineWaveCount').value = 21;
        document.getElementById('sineWaveCountValue').value = 21;
        document.getElementById('sineWaveDistance').value = 30;
        document.getElementById('sineWaveDistanceValue').value = 30;
        
        // Reset glitch controls
        document.getElementById('extraCrush').checked = false;
        if (pixelSortToggle) pixelSortToggle.checked = false;
        if (pixelSortControls) pixelSortControls.style.display = 'none';
        if (pixelSortThreshold) pixelSortThreshold.value = 60; // Use the correct default value
        if (pixelSortThresholdValue) pixelSortThresholdValue.value = 60;
        if (pixelSortAmount) pixelSortAmount.value = 100;
        if (pixelSortAmountValue) pixelSortAmountValue.value = 100;
        if (pixelSortDirectionButtons) {
            pixelSortDirectionButtons.forEach(button => {
                if (button.getAttribute('data-value') === 'horizontal') {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
            currentSortDirection = 'horizontal';
        }
        if (pixelSortCriteriaButtons) {
            pixelSortCriteriaButtons.forEach(button => {
                if (button.getAttribute('data-value') === 'brightness') {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
            currentSortCriteria = 'brightness';
        }
        if (ditherToggle) ditherToggle.checked = true;

        // Reset inversion
        isInverted = false;
        
        // Sync the UI
        syncButtonGroupWithSelect();
        syncColorModeButtonsWithSelect();
        
        // Update visibility of controls
        updateColorPickerVisibility();
        updateAlgorithmControls();
        
        // Reprocess the image with the new settings
        if (originalImage) processImage();
        
        // Show notification
        showNotification('All settings have been reset to default values');
        
        // Update SVG availability after reset
        updateSvgAvailability();
        
        // Reset drop zone and SVG preview backgrounds
        isDefaultBackground = true;
        dropZoneBgColor.value = '#1e1e1e'; // Reset color picker to default value
        const pattern = `
            linear-gradient(45deg, #2a2a2a 25%, transparent 25%), 
            linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #2a2a2a 75%), 
            linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)
        `;
        
        dropZone.style.backgroundImage = pattern;
        dropZone.style.backgroundSize = '20px 20px';
        dropZone.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
        dropZone.style.backgroundColor = ''; // Reset to default CSS value
        
        svgPreview.style.backgroundImage = pattern;
        svgPreview.style.backgroundSize = '20px 20px';
        svgPreview.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
        svgPreview.style.backgroundColor = ''; // Reset to default CSS value
    }

    function handleExportPng() {
        if (!originalImage) {
            showNotification('No image to export', true);
            return;
        }

        try {
            const link = document.createElement('a');
            link.download = 'dithered-image.png';
            link.href = outputCanvas.toDataURL('image/png');
            link.click();
            showNotification('PNG exported successfully');
        } catch (error) {
            showNotification('Error exporting PNG: ' + error.message, true);
        }
    }

    function handleExportSvg() {
        if (!originalImage || !ditherToggle.checked) {
            showNotification('SVG export requires an image with dithering applied', true);
            return;
        }
        
        const width = outputCanvas.width;
        const height = outputCanvas.height;
        
        try {
            loadingOverlay.classList.add('active');
            
            setTimeout(() => {
                // Proceed with SVG export
                const colorModeValue = colorMode.value;
                let svgContent = '';
                
                if (colorModeValue === 'bw' || colorModeValue === 'custom') {
                    svgContent = generateBWSvg();
                } else {
                    svgContent = generateColorSvg();
                }

                // Create a Blob containing the SVG content
                const blob = new Blob([svgContent], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                
                // Create a download link and trigger it
                const a = document.createElement('a');
                a.href = url;
                a.download = 'dithered_image.svg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Clean up
                URL.revokeObjectURL(url);
                loadingOverlay.classList.remove('active');
                showNotification('SVG exported successfully');
            }, 100);
        } catch (error) {
            loadingOverlay.classList.remove('active');
            showNotification('Error exporting SVG: ' + error.message, true);
        }
    }

    function handlePrintImage() {
        if (!originalImage) {
            showNotification('No image to print', true);
            return;
        }

        try {
            loadingOverlay.classList.add('active');
            
            // Create an invisible iframe instead of opening a new window
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '-9999px';
            iframe.style.bottom = '-9999px';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);
            
            // Add CSS for print styling
            const frameDoc = iframe.contentWindow.document;
            frameDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Dithered Image Print</title>
                    <style>
                        @page {
                            margin: 0;
                            size: auto;
                        }
                        html, body {
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: white;
                        }
                        img, svg {
                            max-width: 100%;
                            max-height: 100vh;
                            object-fit: contain;
                        }
                        @media print {
                            body {
                                height: auto;
                            }
                            img, svg {
                                max-height: 100%;
                                width: auto;
                                height: auto;
                            }
                        }
                    </style>
                </head>
                <body>
            `);
            
            // Add the appropriate content based on current mode
            if (currentPreviewMode === 'svg') {
                // Use the SVG content
                let svgContent = '';
                if (colorMode.value === 'bw' || colorMode.value === 'custom') {
                    svgContent = generateBWSvg();
                } else {
                    svgContent = generateColorSvg();
                }
                frameDoc.write(svgContent);
            } else {
                // Use the canvas as PNG
                const dataUrl = outputCanvas.toDataURL('image/png');
                frameDoc.write(`<img src="${dataUrl}" alt="Dithered Image">`);
            }
            
            frameDoc.write('</body></html>');
            frameDoc.close();
            
            // Wait for the content to load before printing
            iframe.onload = function() {
                loadingOverlay.classList.remove('active');
                setTimeout(() => {
                    iframe.contentWindow.print();
                    
                    // Remove the iframe after printing
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 1000);
                }, 200);
            };
            
            showNotification('Preparing image for printing...');
        } catch (error) {
            loadingOverlay.classList.remove('active');
            showNotification('Error printing image: ' + error.message, true);
        }
    }

    // Initialize zoom buttons and drag functionality
    function initZoomAndDrag() {
        // Zoom buttons
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        
        zoomInBtn.addEventListener('click', () => {
            zoom = Math.min(zoom * 1.2, 5); // Limit max zoom to 5x
            updateCanvasTransform();
        });
        
        zoomOutBtn.addEventListener('click', () => {
            zoom = Math.max(zoom / 1.2, 0.5); // Limit min zoom to 0.5x
            updateCanvasTransform();
        });
        
        // Mouse wheel zoom - add to both canvas and SVG preview
        outputCanvas.addEventListener('wheel', handleWheel);
        svgPreview.addEventListener('wheel', handleWheel);
        
        // Drag functionality - add to both canvas and SVG preview
        outputCanvas.addEventListener('mousedown', handleMouseDown);
        svgPreview.addEventListener('mousedown', handleMouseDown);
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        function handleWheel(e) {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            zoom = Math.min(Math.max(zoom * zoomFactor, 0.5), 5);
            updateCanvasTransform();
        }
        
        function handleMouseDown(e) {
            isDragging = true;
            dragStartX = e.clientX - offsetX;
            dragStartY = e.clientY - offsetY;
            
            // Change cursor for both canvas and SVG during dragging
            outputCanvas.style.cursor = 'grabbing';
            svgPreview.style.cursor = 'grabbing';
        }
        
        function handleMouseMove(e) {
            if (!isDragging) return;
            offsetX = e.clientX - dragStartX;
            offsetY = e.clientY - dragStartY;
            updateCanvasTransform();
        }
        
        function handleMouseUp() {
            isDragging = false;
            // Reset cursor for both canvas and SVG
            outputCanvas.style.cursor = 'move';
            svgPreview.style.cursor = 'move';
        }
        
        // Initialize SVG availability
        updateSvgAvailability();
    }

    // Apply transform to canvas and SVG preview
    function updateCanvasTransform() {
        const transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
        
        // Update canvas transform
        outputCanvas.style.transform = transform;
        
        // Update SVG transform
        const svgElement = svgPreview.querySelector('svg');
        if (svgElement) {
            svgElement.style.transform = transform;
        }
    }

    // Reset transform for both canvas and SVG
    function resetTransform() {
        zoom = 1;
        offsetX = 0;
        offsetY = 0;
        updateCanvasTransform();
    }

    // Function to calculate dynamic scale based on image dimensions
    function calculateDynamicScale(width, height) {
        // Check if manual block size is set (not 0/auto)
        const manualBlockSize = parseInt(blockSize.value);
        if (manualBlockSize > 0) {
            return manualBlockSize;
        }
        
        // Otherwise use automatic scaling based on image dimensions
        // Base scale on the smallest dimension to ensure consistent block size
        const minDimension = Math.min(width, height);
        
        // Scale logic - adjust these thresholds as needed
        if (minDimension < 100) return 4;      // Very small images
        if (minDimension < 200) return 3;      // Small images
        if (minDimension < 400) return 2;      // Medium images
        return 1;                              // Large images - no scaling
    }

    // Apply dithering at a reduced resolution and return a smaller result array
    function applyDitheringWithScale(imageData, ditherFunc, threshold, strength, scale) {
        // Create a downscaled version of the image
        const scaledWidth = Math.floor(imageData.width / scale);
        const scaledHeight = Math.floor(imageData.height / scale);
        
        // Create a temporary canvas for downscaling
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = scaledWidth;
        tempCanvas.height = scaledHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Create a temporary image data object
        const scaledImage = tempCtx.createImageData(scaledWidth, scaledHeight);
        
        // Sample the original image to create a downscaled version
        for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < scaledWidth; x++) {
                // Get the average color of the block
                let r = 0, g = 0, b = 0;
                
                for (let dy = 0; dy < scale; dy++) {
                    for (let dx = 0; dx < scale; dx++) {
                        if (y * scale + dy < imageData.height && x * scale + dx < imageData.width) {
                            const origIndex = ((y * scale + dy) * imageData.width + (x * scale + dx)) * 4;
                            r += imageData.data[origIndex];
                            g += imageData.data[origIndex + 1];
                            b += imageData.data[origIndex + 2];
                        }
                    }
                }
                
                const pixelsInBlock = scale * scale;
                r = Math.round(r / pixelsInBlock);
                g = Math.round(g / pixelsInBlock);
                b = Math.round(b / pixelsInBlock);
                
                const scaledIndex = (y * scaledWidth + x) * 4;
                scaledImage.data[scaledIndex] = r;
                scaledImage.data[scaledIndex + 1] = g;
                scaledImage.data[scaledIndex + 2] = b;
                scaledImage.data[scaledIndex + 3] = 255; // Alpha
            }
        }
        
        // Apply the dithering function to the downscaled image
        return ditherFunc(scaledImage, threshold, strength);
    }

    // Draw the scaled result to the canvas
    function drawScaledBlockResult(result, scale) {
        const scaledWidth = Math.floor(outputCanvas.width / scale);
        const scaledHeight = Math.floor(outputCanvas.height / scale);
        
        outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < scaledWidth; x++) {
                const value = result[y * scaledWidth + x];
                outputCtx.fillStyle = `rgb(${value}, ${value}, ${value})`;
                outputCtx.fillRect(
                    x * scale, 
                    y * scale, 
                    scale, 
                    scale
                );
            }
        }
    }

    // Draw the scaled custom color result to the canvas
    function drawScaledCustomColorResult(result, scale) {
        const scaledWidth = Math.floor(outputCanvas.width / scale);
        const scaledHeight = Math.floor(outputCanvas.height / scale);
        
        outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        // Get the custom foreground and background colors
        const foregroundColor = fgColor.value;
        const backgroundColor = bgColor.value;
        
        for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < scaledWidth; x++) {
                const value = result[y * scaledWidth + x];
                outputCtx.fillStyle = value === 0 ? foregroundColor : backgroundColor;
                outputCtx.fillRect(
                    x * scale, 
                    y * scale, 
                    scale, 
                    scale
                );
            }
        }
    }

    // Apply color dithering with scaling for RGB mode
    function ditherColorRGBWithScale(imageData, algorithm, threshold, scale, strength) {
        const scaledWidth = Math.floor(imageData.width / scale);
        const scaledHeight = Math.floor(imageData.height / scale);
        
        // Create downscaled image data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = scaledWidth;
        tempCanvas.height = scaledHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Create a temporary image data object
        const scaledImage = tempCtx.createImageData(scaledWidth, scaledHeight);
        
        // Sample the original image to create a downscaled version
        for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < scaledWidth; x++) {
                // Get the average color of the block
                let r = 0, g = 0, b = 0;
                
                for (let dy = 0; dy < scale; dy++) {
                    for (let dx = 0; dx < scale; dx++) {
                        if (y * scale + dy < imageData.height && x * scale + dx < imageData.width) {
                            const origIndex = ((y * scale + dy) * imageData.width + (x * scale + dx)) * 4;
                            r += imageData.data[origIndex];
                            g += imageData.data[origIndex + 1];
                            b += imageData.data[origIndex + 2];
                        }
                    }
                }
                
                const pixelsInBlock = scale * scale;
                r = Math.round(r / pixelsInBlock);
                g = Math.round(g / pixelsInBlock);
                b = Math.round(b / pixelsInBlock);
                
                const scaledIndex = (y * scaledWidth + x) * 4;
                scaledImage.data[scaledIndex] = r;
                scaledImage.data[scaledIndex + 1] = g;
                scaledImage.data[scaledIndex + 2] = b;
                scaledImage.data[scaledIndex + 3] = 255; // Alpha
            }
        }
        
        // Apply the dither function to each color channel
        const ditherFunc = getDitherFunction(algorithm);
        
        // Create separate image data for each channel
        const rData = new ImageData(new Uint8ClampedArray(scaledImage.data), scaledWidth, scaledHeight);
        const gData = new ImageData(new Uint8ClampedArray(scaledImage.data), scaledWidth, scaledHeight);
        const bData = new ImageData(new Uint8ClampedArray(scaledImage.data), scaledWidth, scaledHeight);
        
        // Extract each channel
        for (let i = 0; i < scaledImage.data.length; i += 4) {
            // Red channel
            rData.data[i] = scaledImage.data[i];
            rData.data[i + 1] = scaledImage.data[i];
            rData.data[i + 2] = scaledImage.data[i];
            
            // Green channel
            gData.data[i] = scaledImage.data[i + 1];
            gData.data[i + 1] = scaledImage.data[i + 1];
            gData.data[i + 2] = scaledImage.data[i + 1];
            
            // Blue channel
            bData.data[i] = scaledImage.data[i + 2];
            bData.data[i + 1] = scaledImage.data[i + 2];
            bData.data[i + 2] = scaledImage.data[i + 2];
        }
        
        // Apply dithering to each channel
        const rResult = ditherFunc(rData, threshold, strength);
        const gResult = ditherFunc(gData, threshold, strength);
        const bResult = ditherFunc(bData, threshold, strength);
        
        // Draw the result to the canvas
        outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < scaledWidth; x++) {
                const index = y * scaledWidth + x;
                
                // Get dithered values for each channel
                const r = rResult[index] === 0 ? 0 : 255;
                const g = gResult[index] === 0 ? 0 : 255;
                const b = bResult[index] === 0 ? 0 : 255;
                
                // Set the pixel color
                outputCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                outputCtx.fillRect(
                    x * scale, 
                    y * scale, 
                    scale, 
                    scale
                );
            }
        }
    }

    // Apply color dithering with scaling for CMYK mode
    function ditherColorCMYKWithScale(imageData, algorithm, threshold, scale, strength) {
        const scaledWidth = Math.floor(imageData.width / scale);
        const scaledHeight = Math.floor(imageData.height / scale);
        
        // Create downscaled image data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = scaledWidth;
        tempCanvas.height = scaledHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Create a temporary image data object
        const scaledImage = tempCtx.createImageData(scaledWidth, scaledHeight);
        
        // Sample the original image to create a downscaled version
        for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < scaledWidth; x++) {
                // Get the average color of the block
                let r = 0, g = 0, b = 0;
                
                for (let dy = 0; dy < scale; dy++) {
                    for (let dx = 0; dx < scale; dx++) {
                        if (y * scale + dy < imageData.height && x * scale + dx < imageData.width) {
                            const origIndex = ((y * scale + dy) * imageData.width + (x * scale + dx)) * 4;
                            r += imageData.data[origIndex];
                            g += imageData.data[origIndex + 1];
                            b += imageData.data[origIndex + 2];
                        }
                    }
                }
                
                const pixelsInBlock = scale * scale;
                r = Math.round(r / pixelsInBlock);
                g = Math.round(g / pixelsInBlock);
                b = Math.round(b / pixelsInBlock);
                
                const scaledIndex = (y * scaledWidth + x) * 4;
                scaledImage.data[scaledIndex] = r;
                scaledImage.data[scaledIndex + 1] = g;
                scaledImage.data[scaledIndex + 2] = b;
                scaledImage.data[scaledIndex + 3] = 255; // Alpha
            }
        }
        
        // Convert RGB to CMYK
        const cData = new ImageData(new Uint8ClampedArray(scaledImage.data), scaledWidth, scaledHeight);
        const mData = new ImageData(new Uint8ClampedArray(scaledImage.data), scaledWidth, scaledHeight);
        const yData = new ImageData(new Uint8ClampedArray(scaledImage.data), scaledWidth, scaledHeight);
        const kData = new ImageData(new Uint8ClampedArray(scaledImage.data), scaledWidth, scaledHeight);
        
        // Extract CMYK channels (simplified conversion)
        for (let i = 0; i < scaledImage.data.length; i += 4) {
            const r = scaledImage.data[i] / 255;
            const g = scaledImage.data[i + 1] / 255;
            const b = scaledImage.data[i + 2] / 255;
            
            // Simplified CMYK conversion
            const k = 1 - Math.max(r, g, b);
            const c = (1 - r - k) / (1 - k) || 0;
            const m = (1 - g - k) / (1 - k) || 0;
            const y = (1 - b - k) / (1 - k) || 0;
            
            // Set channel values (inverted since CMYK is subtractive)
            const cVal = Math.round((1 - c) * 255);
            const mVal = Math.round((1 - m) * 255);
            const yVal = Math.round((1 - y) * 255);
            const kVal = Math.round((1 - k) * 255);
            
            // Cyan channel
            cData.data[i] = cVal;
            cData.data[i + 1] = cVal;
            cData.data[i + 2] = cVal;
            
            // Magenta channel
            mData.data[i] = mVal;
            mData.data[i + 1] = mVal;
            mData.data[i + 2] = mVal;
            
            // Yellow channel
            yData.data[i] = yVal;
            yData.data[i + 1] = yVal;
            yData.data[i + 2] = yVal;
            
            // Black channel
            kData.data[i] = kVal;
            kData.data[i + 1] = kVal;
            kData.data[i + 2] = kVal;
        }
        
        // Apply dithering to each channel
        const ditherFunc = getDitherFunction(algorithm);
        const cResult = ditherFunc(cData, threshold, strength);
        const mResult = ditherFunc(mData, threshold, strength);
        const yResult = ditherFunc(yData, threshold, strength);
        const kResult = ditherFunc(kData, threshold, strength);
        
        // Draw the result to the canvas
        outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < scaledWidth; x++) {
                const index = y * scaledWidth + x;
                
                // Get dithered values for each channel
                const c = cResult[index] === 0 ? 1 : 0; // Invert since in CMYK, 0 means full color
                const m = mResult[index] === 0 ? 1 : 0;
                const yk = yResult[index] === 0 ? 1 : 0;
                const k = kResult[index] === 0 ? 1 : 0;
                
                // Convert CMYK back to RGB
                const r = Math.round(255 * (1 - c) * (1 - k));
                const g = Math.round(255 * (1 - m) * (1 - k));
                const b = Math.round(255 * (1 - yk) * (1 - k));
                
                // Set the pixel color
                outputCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                outputCtx.fillRect(
                    x * scale, 
                    y * scale, 
                    scale, 
                    scale
                );
            }
        }
    }

    // Function to handle multi-color dithering
    function ditherMultiColor(imageData, algorithmName, threshold, strength, ctx) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Get all the colors from the multi-color pickers
        const colorInputs = document.querySelectorAll('.multi-color');
        const paletteColors = Array.from(colorInputs).map(input => hexToRgb(input.value));
        
        if (paletteColors.length < 2) {
            showNotification('At least two colors are required for multi-color mode', true);
            return;
        }
        
        // Create output buffer
        const outputImageData = ctx.createImageData(width, height);
        
        // Special case handling for ordered dithering patterns
        if (algorithmName.startsWith('bayer') || algorithmName === 'halftone') {
            ditherMultiColorOrdered(imageData, algorithmName, threshold, strength, paletteColors, outputImageData);
            ctx.putImageData(outputImageData, 0, 0);
            return;
        }
        
        // Special case for random dithering
        if (algorithmName === 'random') {
            ditherMultiColorRandom(imageData, threshold, strength, paletteColors, outputImageData);
            ctx.putImageData(outputImageData, 0, 0);
            return;
        }
        
        // Special case for threshold
        if (algorithmName === 'threshold') {
            ditherMultiColorThreshold(imageData, threshold, paletteColors, outputImageData);
            ctx.putImageData(outputImageData, 0, 0);
            return;
        }
        
        // Create buffers for error diffusion
        const redErrors = new Float32Array(width * height);
        const greenErrors = new Float32Array(width * height);
        const blueErrors = new Float32Array(width * height);
        
        // Copy original image data to working arrays with floating point precision
        const redChannel = new Float32Array(width * height);
        const greenChannel = new Float32Array(width * height);
        const blueChannel = new Float32Array(width * height);
        
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4;
            redChannel[i] = data[idx];
            greenChannel[i] = data[idx + 1];
            blueChannel[i] = data[idx + 2];
        }
        
        // Get dithering pattern based on selected algorithm
        const pattern = getDitherPattern(algorithmName);
        
        // Apply dithering
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const idx = i * 4;
                
                // Get the current pixel color with accumulated errors
                const r = Math.max(0, Math.min(255, redChannel[i] + redErrors[i]));
                const g = Math.max(0, Math.min(255, greenChannel[i] + greenErrors[i]));
                const b = Math.max(0, Math.min(255, blueChannel[i] + blueErrors[i]));
                
                // Find the closest color in our palette
                const closestColor = findClosestColor(r, g, b, paletteColors);
                
                // Set the output pixel to the closest color
                outputImageData.data[idx] = closestColor.r;
                outputImageData.data[idx + 1] = closestColor.g;
                outputImageData.data[idx + 2] = closestColor.b;
                outputImageData.data[idx + 3] = 255;
                
                // Calculate the error
                const errR = (r - closestColor.r) * strength;
                const errG = (g - closestColor.g) * strength;
                const errB = (b - closestColor.b) * strength;
                
                // Distribute the error according to the dithering pattern
                for (const [dx, dy, w] of pattern) {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const ni = ny * width + nx;
                        redErrors[ni] += errR * w;
                        greenErrors[ni] += errG * w;
                        blueErrors[ni] += errB * w;
                    }
                }
            }
        }
        
        // Put the result onto the canvas
        ctx.putImageData(outputImageData, 0, 0);
    }

    // Handle multi-color ordered dithering (Bayer, etc.)
    function ditherMultiColorOrdered(imageData, algorithmName, threshold, strength, palette, outputImageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Get appropriate matrix
        let matrix;
        switch (algorithmName) {
            case 'bayer':
                matrix = generateBayerMatrix(8);
                break;
            case 'bayer4':
                matrix = generateBayerMatrix(4);
                break;
            case 'bayer2':
                matrix = generateBayerMatrix(2);
                break;
            case 'halftone':
                // Simple halftone matrix
                matrix = [
                    [0, 8, 2, 10],
                    [12, 4, 14, 6],
                    [3, 11, 1, 9],
                    [15, 7, 13, 5]
                ];
                break;
            default:
                matrix = generateBayerMatrix(8);
        }
        
        const matrixSize = matrix.length;
        const colorLevels = palette.length;
        
        // Normalize the matrix values to the number of colors we have
        const normalizedMatrix = [];
        for (let i = 0; i < matrixSize; i++) {
            normalizedMatrix[i] = [];
            for (let j = 0; j < matrixSize; j++) {
                normalizedMatrix[i][j] = matrix[i][j] / (matrixSize * matrixSize) * (colorLevels - 1);
            }
        }
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const idx = i * 4;
                
                // Get the color of the current pixel
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Calculate the luminance (brightness) of the pixel
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                
                // Get the threshold for this position
                const mx = x % matrixSize;
                const my = y % matrixSize;
                const matrixThreshold = normalizedMatrix[my][mx];
                
                // Map luminance to palette index
                // We normalize the luminance to [0-1] then scale to palette size
                const normalizedValue = luminance / 255;
                
                // Apply threshold with dither matrix
                const colorIndex = Math.floor(normalizedValue * colorLevels + matrixThreshold) % colorLevels;
                
                // Get the color from the palette
                const color = palette[colorIndex];
                
                // Set the output pixel
                outputImageData.data[idx] = color.r;
                outputImageData.data[idx + 1] = color.g;
                outputImageData.data[idx + 2] = color.b;
                outputImageData.data[idx + 3] = 255;
            }
        }
    }

    // Handle multi-color random dithering
    function ditherMultiColorRandom(imageData, threshold, strength, palette, outputImageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const colorCount = palette.length;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const idx = i * 4;
                
                // Get the color of the current pixel
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Calculate the luminance (brightness) of the pixel
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                
                // Add random noise based on strength
                const noise = (Math.random() - 0.5) * strength * 255;
                const adjustedLuminance = Math.max(0, Math.min(255, luminance + noise));
                
                // Map to color index
                const colorIndex = Math.floor(adjustedLuminance / 255 * colorCount);
                const boundedIndex = Math.max(0, Math.min(colorCount - 1, colorIndex));
                
                // Get the color from the palette
                const color = palette[boundedIndex];
                
                // Set the output pixel
                outputImageData.data[idx] = color.r;
                outputImageData.data[idx + 1] = color.g;
                outputImageData.data[idx + 2] = color.b;
                outputImageData.data[idx + 3] = 255;
            }
        }
    }

    // Handle multi-color threshold dithering (simplest method)
    function ditherMultiColorThreshold(imageData, threshold, palette, outputImageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const colorCount = palette.length;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const idx = i * 4;
                
                // Get the color of the current pixel
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Find the closest color in the palette
                const closestColor = findClosestColor(r, g, b, palette);
                
                // Set the output pixel
                outputImageData.data[idx] = closestColor.r;
                outputImageData.data[idx + 1] = closestColor.g;
                outputImageData.data[idx + 2] = closestColor.b;
                outputImageData.data[idx + 3] = 255;
            }
        }
    }

    // Find the closest color in the palette to the given RGB color
    function findClosestColor(r, g, b, palette) {
        let closestColor = palette[0];
        let minDistance = Number.MAX_VALUE;
        
        for (const color of palette) {
            // Use a perceptually weighted color distance formula
            const dr = (r - color.r);
            const dg = (g - color.g);
            const db = (b - color.b);
            
            // Use a better color distance formula (CIEDE2000 simplified)
            const distance = 0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db;
            
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = color;
            }
        }
        
        return closestColor;
    }

    // Get the appropriate error diffusion pattern for the given algorithm
    function getDitherPattern(algorithmName) {
        switch (algorithmName) {
            case 'floydSteinberg':
                return [
                    [1, 0, 7/16],
                    [-1, 1, 3/16],
                    [0, 1, 5/16],
                    [1, 1, 1/16]
                ];
            case 'atkinson':
                return [
                    [1, 0, 1/8],
                    [2, 0, 1/8],
                    [-1, 1, 1/8],
                    [0, 1, 1/8],
                    [1, 1, 1/8],
                    [0, 2, 1/8]
                ];
            case 'jarvis':
                return [
                    [1, 0, 7/48],
                    [2, 0, 5/48],
                    [-2, 1, 3/48],
                    [-1, 1, 5/48],
                    [0, 1, 7/48],
                    [1, 1, 5/48],
                    [2, 1, 3/48],
                    [-2, 2, 1/48],
                    [-1, 2, 3/48],
                    [0, 2, 5/48],
                    [1, 2, 3/48],
                    [2, 2, 1/48]
                ];
            case 'stucki':
                return [
                    [1, 0, 8/42],
                    [2, 0, 4/42],
                    [-2, 1, 2/42],
                    [-1, 1, 4/42],
                    [0, 1, 8/42],
                    [1, 1, 4/42],
                    [2, 1, 2/42],
                    [-2, 2, 1/42],
                    [-1, 2, 2/42],
                    [0, 2, 4/42],
                    [1, 2, 2/42],
                    [2, 2, 1/42]
                ];
            case 'burkes':
                return [
                    [1, 0, 8/32],
                    [2, 0, 4/32],
                    [-2, 1, 2/32],
                    [-1, 1, 4/32],
                    [0, 1, 8/32],
                    [1, 1, 4/32],
                    [2, 1, 2/32]
                ];
            case 'sierra':
                return [
                    [1, 0, 5/32],
                    [2, 0, 3/32],
                    [-2, 1, 2/32],
                    [-1, 1, 4/32],
                    [0, 1, 5/32],
                    [1, 1, 4/32],
                    [2, 1, 2/32],
                    [-1, 2, 2/32],
                    [0, 2, 3/32],
                    [1, 2, 2/32]
                ];
            case 'sierra2':
                return [
                    [1, 0, 4/16],
                    [2, 0, 3/16],
                    [-2, 1, 1/16],
                    [-1, 1, 2/16],
                    [0, 1, 3/16],
                    [1, 1, 2/16],
                    [2, 1, 1/16]
                ];
            case 'sierraLite':
                return [
                    [1, 0, 2/4],
                    [-1, 1, 1/4],
                    [0, 1, 1/4]
                ];
            case 'random':
                // Return a special pattern that will be handled differently
                return 'random';
            case 'threshold':
                // Simple thresholding, no error diffusion
                return [];
            case 'bayer':
            case 'bayer4':
            case 'bayer2':
            case 'halftone':
                // For ordered dithering, we'll use a special approach
                return 'ordered';
            default:
                return [
                    [1, 0, 7/16],
                    [-1, 1, 3/16],
                    [0, 1, 5/16],
                    [1, 1, 1/16]
                ];
        }
    }

    // Add a new color picker
    addColorBtn.addEventListener('click', function() {
        const row = document.createElement('div');
        row.className = 'color-picker-row';
        
        // Generate a random color
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        
        row.innerHTML = `
            <div class="color-picker">
                <input type="color" class="multi-color" value="${randomColor}">
            </div>
            <div class="delete-color">
                <button class="delete-color-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Add delete button functionality
        row.querySelector('.delete-color-btn').addEventListener('click', function() {
            row.remove();
            if (originalImage) processImage();
        });
        
        // Add change event to the color picker
        row.querySelector('.multi-color').addEventListener('input', function() {
            if (originalImage) processImage();
        });
        
        colorPickersContainer.appendChild(row);
        
        if (originalImage) processImage();
    });
    
    // Initialize delete buttons for existing color pickers
    document.querySelectorAll('.delete-color-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('.color-picker-row');
            // Only allow deletion if there are more than 2 colors
            if (colorPickersContainer.querySelectorAll('.color-picker-row').length > 2) {
                row.remove();
                if (originalImage) processImage();
            } else {
                showNotification('At least two colors are required', true);
            }
        });
    });
    
    // Initialize change events for existing color pickers
    document.querySelectorAll('.multi-color').forEach(picker => {
        picker.addEventListener('input', function() {
            if (originalImage) processImage();
        });
    });

    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.classList.toggle('error', isError);
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    function generateColorSvg() {
        // Use the processed canvas for SVG generation
        const processedCanvas = window.processedCanvas;
        if (!processedCanvas) return '';
        
        const processingWidth = processedCanvas.width;
        const processingHeight = processedCanvas.height;
        const processedCtx = processedCanvas.getContext('2d');
        const processedData = processedCtx.getImageData(0, 0, processingWidth, processingHeight).data;
        
        // Original dimensions for SVG viewBox
        const width = outputCanvas.width;
        const height = outputCanvas.height;
        
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
        svg += `  <rect width="${width}" height="${height}" fill="white"/>\n`;
        
        // Calculate pixel size in SVG coordinates
        const pixelWidth = width / processingWidth;
        const pixelHeight = height / processingHeight;
        
        // Group pixels by color to reduce file size
        const colorGroups = new Map();
        
        for (let y = 0; y < processingHeight; y++) {
            for (let x = 0; x < processingWidth; x++) {
                const i = (y * processingWidth + x) * 4;
                const r = processedData[i];
                const g = processedData[i + 1];
                const b = processedData[i + 2];
                
                // Skip white pixels
                if (r === 255 && g === 255 && b === 255) continue;
                
                const color = `rgb(${r},${g},${b})`;
                
                if (!colorGroups.has(color)) {
                    colorGroups.set(color, []);
                }
                
                colorGroups.get(color).push({ x, y });
            }
        }
        
        // Add a path for each color group
        for (const [color, pixels] of colorGroups) {
            svg += `  <path d="`;
            
            for (const { x, y } of pixels) {
                const px = x * pixelWidth;
                const py = y * pixelHeight;
                svg += `M${px},${py}h${pixelWidth}v${pixelHeight}h-${pixelWidth}z `;
            }
            
            svg += `" fill="${color}"/>\n`;
        }
        
        svg += '</svg>';
        
        return svg;
    }

    // Initialize algorithm-specific controls
    const bitToneControls = document.getElementById('bitToneControls');
    const mosaicControls = document.getElementById('mosaicControls');
    const patternControls = document.getElementById('patternControls');
    const waveControls = document.getElementById('waveControls');
    
    const bitDepth = document.getElementById('bitDepth');
    const bitDepthValue = document.getElementById('bitDepthValue');
    const mosaicSize = document.getElementById('mosaicSize');
    const mosaicSizeValue = document.getElementById('mosaicSizeValue');
    const patternSize = document.getElementById('patternSize');
    const patternSizeValue = document.getElementById('patternSizeValue');
    const patternAngle = document.getElementById('patternAngle');
    const patternAngleValue = document.getElementById('patternAngleValue');
    const waveLength = document.getElementById('waveLength');
    const waveLengthValue = document.getElementById('waveLengthValue');
    const waveAmplitude = document.getElementById('waveAmplitude');
    const waveAmplitudeValue = document.getElementById('waveAmplitudeValue');

    // Add event listeners for algorithm-specific controls if they exist
    if (bitDepth) bitDepth.addEventListener('input', updateBitDepthValue);
    if (mosaicSize) mosaicSize.addEventListener('input', updateMosaicSizeValue);
    if (patternSize) patternSize.addEventListener('input', updatePatternSizeValue);
    if (patternAngle) patternAngle.addEventListener('input', updatePatternAngleValue);
    if (waveLength) waveLength.addEventListener('input', updateWaveLengthValue);
    if (waveAmplitude) waveAmplitude.addEventListener('input', updateWaveAmplitudeValue);
    
    // Add additional event listener for algorithm change
    algorithm.addEventListener('change', updateAlgorithmControls);
    
    // Function to show/hide algorithm-specific controls
    function updateAlgorithmControls() {
        // Hide all algorithm-specific controls first
        document.querySelectorAll('.algorithm-specific-controls').forEach(container => {
            container.style.display = 'none';
        });
        
        // Show specific controls based on the selected algorithm
        const algorithm = document.getElementById('algorithm').value;
        
        // Bit Tone Controls
        if (algorithm === 'bitTone') {
            document.getElementById('bitToneControls').style.display = 'block';
        }
        
        // Mosaic Controls
        if (algorithm === 'mosaic') {
            document.getElementById('mosaicControls').style.display = 'block';
        }
        
        // Pattern Controls (used by several algorithms)
        if (['radialBurst', 'vortex', 'checkerSmall', 'diamond', 'hModulation'].includes(algorithm)) {
            document.getElementById('patternControls').style.display = 'block';
        }
        
        // Sine Wave Controls
        if (algorithm === 'sineWave') {
            document.getElementById('sineWaveControls').style.display = 'block';
        }
        
        // Wave Controls
        if (['wave', 'gridlock'].includes(algorithm)) {
            document.getElementById('waveControls').style.display = 'block';
        }
        
        // Update color mode availability based on whether this is a pattern algorithm
        const isPatternAlgorithm = ['halftone', 'checkerSmall', 'radialBurst', 'vortex', 'diamond', 'sineWave', 'wave', 'gridlock', 'mosaic', 'hModulation'].includes(algorithm);
        updateColorModeAvailability(isPatternAlgorithm);
    }
    
    // Value update functions for new sliders
    function updateBitDepthValue() {
        bitDepthValue.textContent = bitDepth.value + " levels";
        if (originalImage) processImage();
    }
    
    function updateMosaicSizeValue() {
        mosaicSizeValue.textContent = mosaicSize.value + "px";
        if (originalImage) processImage();
    }
    
    function updatePatternSizeValue() {
        patternSizeValue.textContent = patternSize.value;
        if (originalImage) processImage();
    }
    
    function updatePatternAngleValue() {
        patternAngleValue.textContent = patternAngle.value + '°';
        if (originalImage) processImage();
    }
    
    function updateWaveLengthValue() {
        waveLengthValue.textContent = waveLength.value;
        if (originalImage) processImage();
    }
    
    function updateWaveAmplitudeValue() {
        waveAmplitudeValue.textContent = waveAmplitude.value;
        if (originalImage) processImage();
    }

    // Bit Tone Dithering - reduces the bit depth of the image
    function bitToneDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get the bit depth from the slider
        const depth = parseInt(bitDepth?.value || 3);
        const levels = Math.pow(2, depth);
        const step = 255 / (levels - 1);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                
                // Apply bit depth reduction
                const quantized = Math.round(Math.round(gray / step) * step);
                result[y * width + x] = quantized;
            }
        }
        
        return result;
    }

    // Checker Pattern Dithering (combined function)
    function checkerDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get the pattern size from the slider
        const size = parseInt(patternSize?.value || 2);
        
        // Create a checker pattern at the specified size
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                
                // Determine if this is a 'black' or 'white' square in the checker pattern
                const isBlackSquare = ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0);
                
                // Apply different thresholds based on the checker pattern
                const adjustedThreshold = isBlackSquare ? threshold * 0.75 : threshold * 1.25;
                
                // Apply the threshold
                result[y * width + x] = gray < adjustedThreshold ? 0 : 255;
            }
        }
        
        return result;
    }

    // Radial Burst Dithering
    function radialBurstDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get the pattern size and angle from sliders
        const patternSizeValue = parseFloat(patternSize?.value || 2);
        const angleInRadians = (parseInt(patternAngle?.value || 0) * Math.PI / 180);
        
        // Calculate the center of the image
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                
                // Calculate distance from center
                let dx = x - centerX;
                let dy = y - centerY;
                
                // Rotate according to angle slider
                const rotatedX = dx * Math.cos(angleInRadians) - dy * Math.sin(angleInRadians);
                const rotatedY = dx * Math.sin(angleInRadians) + dy * Math.cos(angleInRadians);
                
                // Calculate distance from center (for radius)
                const distance = Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY);
                
                // Create alternating concentric rings - use patternSizeValue directly for finer control
                const radiusModifier = Math.sin(distance * (1 / patternSizeValue)) * 0.5 + 0.5;
                
                // Apply adjusted threshold
                const adjustedThreshold = threshold * radiusModifier;
                result[y * width + x] = gray < adjustedThreshold ? 0 : 255;
            }
        }
        
        return result;
    }

    // Vortex Dithering
    function vortexDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get the pattern size and angle from sliders
        const patternSizeValue = parseFloat(patternSize?.value || 2);
        const angleInRadians = (parseInt(patternAngle?.value || 0) * Math.PI / 180);
        
        // Calculate the center of the image
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                
                // Calculate distance from center
                let dx = x - centerX;
                let dy = y - centerY;
                
                // Apply initial rotation based on angle slider
                const rotatedX = dx * Math.cos(angleInRadians) - dy * Math.sin(angleInRadians);
                const rotatedY = dx * Math.sin(angleInRadians) + dy * Math.cos(angleInRadians);
                
                // Calculate distance from center (for radius)
                const distance = Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY);
                
                // Calculate angle in radians
                const angle = Math.atan2(rotatedY, rotatedX);
                
                // Create a vortex pattern by combining angle and distance
                // Modified to use pattern size more effectively with a multiplier
                const vortexModifier = Math.sin(angle * 3 + distance * (1 / patternSizeValue)) * 0.5 + 0.5;
                
                // Apply adjusted threshold
                const adjustedThreshold = threshold * vortexModifier;
                result[y * width + x] = gray < adjustedThreshold ? 0 : 255;
            }
        }
        
        return result;
    }

    // Diamond Dithering
    function diamondDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get the pattern size and angle from sliders
        const patternSizeValue = parseInt(patternSize?.value || 8);
        const angleInRadians = (parseInt(patternAngle?.value || 0) * Math.PI / 180);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                
                // Rotate coordinates
                const rotatedX = x * Math.cos(angleInRadians) - y * Math.sin(angleInRadians);
                const rotatedY = x * Math.sin(angleInRadians) + y * Math.cos(angleInRadians);
                
                // Create diamond pattern
                const diamondPattern = (Math.abs(rotatedX % (patternSizeValue * 2) - patternSizeValue) + 
                                      Math.abs(rotatedY % (patternSizeValue * 2) - patternSizeValue)) / (2 * patternSizeValue);
                
                // Apply adjusted threshold
                const adjustedThreshold = threshold * diamondPattern;
                result[y * width + x] = gray < adjustedThreshold ? 0 : 255;
            }
        }
        
        return result;
    }

    // Wave Dithering
    function waveDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get wave parameters from sliders
        const waveLengthValue = parseInt(waveLength?.value || 16);
        const waveAmplitudeValue = parseInt(waveAmplitude?.value || 8);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                
                // Create a wave pattern using sine function
                const horizontalWave = Math.sin(x / waveLengthValue * Math.PI * 2) * waveAmplitudeValue;
                const verticalWave = Math.sin(y / waveLengthValue * Math.PI * 2) * waveAmplitudeValue;
                
                // Calculate distance to the nearest wave
                const distanceToWave = Math.min(
                    Math.abs(y - Math.round(y + horizontalWave)),
                    Math.abs(x - Math.round(x + verticalWave))
                );
                
                // Normalize to 0-1 range for threshold modification
                const waveModifier = 1 - Math.min(1, distanceToWave / waveAmplitudeValue);
                
                // Apply adjusted threshold
                const adjustedThreshold = threshold * (waveModifier * 0.5 + 0.75);
                result[y * width + x] = gray < adjustedThreshold ? 0 : 255;
            }
        }
        
        return result;
    }

    // Gridlock Dithering (now called Tiles2)
    function gridlockDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get the pattern size and angle from sliders
        const patternSizeValue = parseFloat(patternSize?.value || 8);
        const angleInRadians = (parseInt(patternAngle?.value || 0) * Math.PI / 180);
        
        // Calculate the center of the image
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                
                // Calculate coordinates relative to center
                const dx = x - centerX;
                const dy = y - centerY;
                
                // Rotate coordinates around center
                const rotatedX = dx * Math.cos(angleInRadians) - dy * Math.sin(angleInRadians);
                const rotatedY = dx * Math.sin(angleInRadians) + dy * Math.cos(angleInRadians);
                
                // Create a grid pattern
                const xGrid = Math.abs(rotatedX) % patternSizeValue;
                const yGrid = Math.abs(rotatedY) % patternSizeValue;
                const isOnEdge = xGrid < 1 || yGrid < 1 || xGrid > patternSizeValue - 1 || yGrid > patternSizeValue - 1;
                
                // Apply grid-based thresholding
                const adjustedThreshold = isOnEdge ? threshold * 1.5 : threshold * 0.5;
                result[y * width + x] = gray < adjustedThreshold ? 0 : 255;
            }
        }
        
        return result;
    }

    // Mosaic Dithering
    function mosaicDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get the mosaic block size
        const blockSize = parseInt(mosaicSize?.value || 4);
        
        // Process the image in blocks
        for (let blockY = 0; blockY < height; blockY += blockSize) {
            for (let blockX = 0; blockX < width; blockX += blockSize) {
                // Calculate the average color in this block
                let totalGray = 0;
                let count = 0;
                
                // Gather block pixel data
                for (let y = blockY; y < Math.min(blockY + blockSize, height); y++) {
                    for (let x = blockX; x < Math.min(blockX + blockSize, width); x++) {
                        const i = (y * width + x) * 4;
                        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                        totalGray += gray;
                        count++;
                    }
                }
                
                // Calculate average gray value for the block
                const avgGray = totalGray / count;
                
                // Apply threshold to the average
                const blockValue = avgGray < threshold ? 0 : 255;
                
                // Fill the block with the resulting value
                for (let y = blockY; y < Math.min(blockY + blockSize, height); y++) {
                    for (let x = blockX; x < Math.min(blockX + blockSize, width); x++) {
                        result[y * width + x] = blockValue;
                    }
                }
            }
        }
        
        return result;
    }

    // Sine Wave Dithering
    function sineWaveDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get parameters from sliders
        const waveLength = parseInt(sineWaveLength?.value || 55);
        const amplitude = parseInt(sineWaveAmplitude?.value || 15);
        const thickness = parseFloat(sineWaveThickness?.value || 5);
        const rotationDegrees = parseInt(sineWaveRotation?.value || 90);
        const waveCount = parseInt(sineWaveCount?.value || 21);
        const waveDistance = parseInt(sineWaveDistance?.value || 30);
        
        // Convert rotation to radians
        const rotation = (rotationDegrees * Math.PI) / 180;
        
        // Calculate the center of the image
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                
                // Calculate coordinates relative to center for rotation
                const dx = x - centerX;
                const dy = y - centerY;
                
                // Apply rotation
                const rotatedX = dx * Math.cos(rotation) - dy * Math.sin(rotation);
                const rotatedY = dx * Math.sin(rotation) + dy * Math.cos(rotation);
                
                // Calculate minimum distance to any of the waves
                let minDistanceToWave = Infinity;
                
                // Generate multiple waves based on waveCount
                for (let w = -Math.floor(waveCount/2); w <= Math.floor(waveCount/2); w++) {
                    // Skip the iteration if waveCount is even and w is 0
                    if (waveCount % 2 === 0 && w === 0) continue;
                    
                    // Calculate offset for this wave
                    const waveOffset = w * waveDistance;
                    
                    // Calculate sine wave value based on rotated coordinates
                    const waveValue = Math.sin((rotatedY / waveLength) * 2 * Math.PI);
                    
                    // Calculate distance from the sine wave, including the wave offset
                    const waveY = amplitude * waveValue;
                    const distanceToWave = Math.abs(rotatedX - waveY - waveOffset);
                    
                    // Keep track of the minimum distance to any wave
                    minDistanceToWave = Math.min(minDistanceToWave, distanceToWave);
                }
                
                // Apply threshold based on distance to the nearest wave
                // Points closer to any wave have a lower threshold (more likely to be black)
                // Use the thickness parameter to control how "thick" the waves appear
                const waveEffect = Math.exp(-minDistanceToWave / thickness);
                
                // Adjust threshold based on wave effect
                const adjustedThreshold = threshold * (1 - 0.7 * waveEffect);
                
                // Apply the threshold
                result[y * width + x] = gray < adjustedThreshold ? 0 : 255;
            }
        }
        
        return result;
    }

    // Call updateAlgorithmControls on initial load to show/hide controls based on default algorithm
    // Only call if the controls exist
    if (bitToneControls && mosaicControls && patternControls && waveControls && sineWaveControls) {
        updateAlgorithmControls();
    }

    // Make sure algorithm controls are initialized
    document.addEventListener('DOMContentLoaded', function() {
        // Only call if the controls exist
        if (typeof updateAlgorithmControls === 'function') {
            updateAlgorithmControls();
        }
    });

    // Add event listeners for algorithm button group
    initAlgorithmButtonGroup();
    
    // ... existing code ...
    
    // Algorithm button group functionality
    function initAlgorithmButtonGroup() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const algoButtons = document.querySelectorAll('.algo-btn');
        
        // Add event listeners for category buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all category buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const category = button.dataset.category;
                
                // Hide all algorithm groups
                document.querySelectorAll('.algorithm-group').forEach(group => {
                    group.style.display = 'none';
                });
                
                // Show the selected category group
                document.querySelector(`.algorithm-group[data-category="${category}"]`).style.display = 'flex';
                
                // Update color mode availability based on selected category
                updateColorModeAvailability(category === 'patterns');
            });
        });
        
        // Add event listeners for algorithm buttons
        algoButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all algorithm buttons
                algoButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update the hidden select element
                const value = button.dataset.value;
                const selectElement = document.getElementById('algorithm');
                selectElement.value = value;
                
                // Check if the current algorithm is in the patterns category
                const isPatternAlgorithm = button.closest('.algorithm-group').dataset.category === 'patterns';
                updateColorModeAvailability(isPatternAlgorithm);
                
                // Trigger change event on select to process the image
                const event = new Event('change');
                selectElement.dispatchEvent(event);
            });
        });
        
        // Initial sync with select value
        syncButtonGroupWithSelect();
        
        // Check if initially selected algorithm is a pattern
        const initialCategory = document.querySelector('.algorithm-group[style*="display: flex"]').dataset.category;
        updateColorModeAvailability(initialCategory === 'patterns');
    }
    
    // Sync the button UI with the select value (useful after reset)
    function syncButtonGroupWithSelect() {
        const currentValue = algorithm.value;
        const algoButtons = document.querySelectorAll('.algo-btn');
        
        // Remove active class from all buttons
        algoButtons.forEach(btn => btn.classList.remove('active'));
        
        // Find the button that matches the current value and activate it
        const targetButton = document.querySelector(`.algo-btn[data-value="${currentValue}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
            
            // Also activate the correct category
            const categoryGroup = targetButton.closest('.algorithm-group');
            if (categoryGroup) {
                const category = categoryGroup.dataset.category;
                
                // Remove active class from all category buttons
                document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                
                // Activate the correct category button
                document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
                
                // Hide all algorithm groups
                document.querySelectorAll('.algorithm-group').forEach(group => {
                    group.style.display = 'none';
                });
                
                // Show the correct group
                categoryGroup.style.display = 'flex';
            }
        }
    }
    
    // Update the resetSettings function to sync the UI after reset
    const originalResetSettings = resetSettings;
    resetSettings = function() {
        originalResetSettings();
        syncButtonGroupWithSelect();
        syncColorModeButtonsWithSelect();
    };
    
    // ... existing code ...

    // Initialize color mode buttons
    initColorModeButtons();

    function initColorModeButtons() {
        const colorModeButtons = document.querySelectorAll('.color-mode-btn');
        
        colorModeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                colorModeButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update the hidden select element
                const value = button.dataset.value;
                colorMode.value = value;
                
                // Trigger change event on select to process the image
                const event = new Event('change');
                colorMode.dispatchEvent(event);
            });
        });
        
        // Initialize buttons to match current select value
        syncColorModeButtonsWithSelect();
    }
    
    // Sync color mode buttons with select value
    function syncColorModeButtonsWithSelect() {
        const currentValue = colorMode.value;
        const colorModeButtons = document.querySelectorAll('.color-mode-btn');
        
        // Remove active class from all buttons
        colorModeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Find and activate the button that matches the select value
        const targetButton = document.querySelector(`.color-mode-btn[data-value="${currentValue}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
    }
    
    // Function to update color mode button availability based on algorithm category
    function updateColorModeAvailability(isPatternAlgorithm) {
        const multiColorButton = document.querySelector('.color-mode-btn[data-value="multicolor"]');
        
        if (isPatternAlgorithm) {
            // If a pattern algorithm is selected, disable multicolor
            multiColorButton.style.opacity = '0.5';
            multiColorButton.style.pointerEvents = 'none';
            
            // If multicolor is currently selected, switch to B&W
            if (colorMode.value === 'multicolor') {
                colorMode.value = 'bw';
                syncColorModeButtonsWithSelect();
                const event = new Event('change');
                colorMode.dispatchEvent(event);
            }
        } else {
            // Otherwise, enable multicolor
            multiColorButton.style.opacity = '1';
            multiColorButton.style.pointerEvents = 'auto';
        }
    }

    // Function to toggle color inversion
    function toggleInvertColors() {
        if (!originalImage) {
            showNotification('No image to invert', true);
            return;
        }
        
        // Toggle inversion state
        isInverted = !isInverted;
        
        // Update button appearance to show active/inactive state
        const invertBtn = document.getElementById('invertBtn');
        if (isInverted) {
            invertBtn.classList.add('active');
        } else {
            invertBtn.classList.remove('active');
        }
        
        // Reprocess the image with the new inversion setting
        processImage();
        showNotification(isInverted ? 'Colors inverted' : 'Colors restored');
    }

    // Initialize section toggle functionality
    function initSectionToggle() {
        // Get all section headers with icons
        const sectionHeaders = document.querySelectorAll('.control-group h3');
        const controlPanel = document.querySelector('.control-panel');
        const imageContainer = document.querySelector('.image-container');
        
        sectionHeaders.forEach(header => {
            // Add click event to the icon
            const icon = header.querySelector('i');
            if (icon) {
                // Make the whole header clickable for better UX
                header.style.cursor = 'pointer';
                
                header.addEventListener('click', function(e) {
                    const controlGroup = this.closest('.control-group');
                    const contents = controlGroup.querySelectorAll(':scope > *:not(h3)');
                    
                    // Toggle collapsed state
                    controlGroup.classList.toggle('collapsed');
                    
                    // Toggle content visibility
                    if (controlGroup.classList.contains('collapsed')) {
                        contents.forEach(content => {
                            content.style.display = 'none';
                        });
                    } else {
                        contents.forEach(content => {
                            content.style.display = '';
                        });
                    }
                    
                    // Check if all panels are collapsed
                    const allPanels = document.querySelectorAll('.control-group');
                    const allCollapsed = Array.from(allPanels).every(panel => 
                        panel.classList.contains('collapsed')
                    );
                    
                    // Update the control panel and image container classes
                    if (allCollapsed) {
                        controlPanel.classList.add('all-collapsed');
                        imageContainer.classList.add('expanded');
                    } else {
                        controlPanel.classList.remove('all-collapsed');
                        imageContainer.classList.remove('expanded');
                    }
                });
            }
        });
    }

    // Check if all panels are collapsed and update UI accordingly
    function checkAllPanelsCollapsed() {
        const controlPanel = document.querySelector('.control-panel');
        const imageContainer = document.querySelector('.image-container');
        const allPanels = document.querySelectorAll('.control-group');
        
        const allCollapsed = Array.from(allPanels).every(panel => 
            panel.classList.contains('collapsed')
        );
        
        if (allCollapsed) {
            controlPanel.classList.add('all-collapsed');
            imageContainer.classList.add('expanded');
        } else {
            controlPanel.classList.remove('all-collapsed');
            imageContainer.classList.remove('expanded');
        }
    }

    // Initialize everything when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing code ...
        
        // Initialize section toggle
        initSectionToggle();
        
        // Check if all panels are collapsed
        checkAllPanelsCollapsed();
        
        // Initialize theme color picker
        initThemeColorPicker();
    });

    // Add value update functions for the new sliders
    function updateSineWaveLengthValue() {
        sineWaveLengthValue.textContent = sineWaveLength.value;
        if (originalImage) processImage();
    }

    function updateSineWaveAmplitudeValue() {
        sineWaveAmplitudeValue.textContent = sineWaveAmplitude.value;
        if (originalImage) processImage();
    }

    function updateSineWaveThicknessValue() {
        sineWaveThicknessValue.textContent = sineWaveThickness.value;
        if (originalImage) processImage();
    }

    function updateSineWaveRotationValue() {
        sineWaveRotationValue.textContent = sineWaveRotation.value + '°';
        if (originalImage) processImage();
    }

    function updateSineWaveCountValue() {
        sineWaveCountValue.textContent = sineWaveCount.value;
        if (originalImage) processImage();
    }

    function updateSineWaveDistanceValue() {
        sineWaveDistanceValue.textContent = sineWaveDistance.value;
        if (originalImage) processImage();
    }
    
    // ... existing code ...
    
    // Theme color picker functionality
    function initThemeColorPicker() {
        const themeColorPicker = document.getElementById('themeColorPicker');
        
        // Set initial value to match CSS variable
        const initialColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        themeColorPicker.value = initialColor;
        
        themeColorPicker.addEventListener('input', function() {
            updateThemeColor(this.value);
        });
        
        themeColorPicker.addEventListener('change', function() {
            updateThemeColor(this.value);
            showNotification('UI theme color updated!');
        });
    }
    
    function updateThemeColor(color) {
        document.documentElement.style.setProperty('--primary', color);
        
        // Calculate darker shade for hover state (approximately 10% darker)
        const darkerColor = calculateDarkerShade(color, 0.1);
        document.documentElement.style.setProperty('--primary-hover', darkerColor);
    }
    
    function calculateDarkerShade(hexColor, percent) {
        // Convert hex to RGB
        let r = parseInt(hexColor.substring(1, 3), 16);
        let g = parseInt(hexColor.substring(3, 5), 16);
        let b = parseInt(hexColor.substring(5, 7), 16);
        
        // Make darker
        r = Math.max(0, Math.floor(r * (1 - percent)));
        g = Math.max(0, Math.floor(g * (1 - percent)));
        b = Math.max(0, Math.floor(b * (1 - percent)));
        
        // Convert back to hex
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Image Cropping Functionality with Cropper.js
    let cropper = null; // Will hold our cropper instance
    const cropBtn = document.getElementById('cropBtn');
    const cropContainer = document.getElementById('cropContainer');
    const applyCropBtn = document.getElementById('applyCrop');
    const cancelCropBtn = document.getElementById('cancelCrop');
    const cropWarningModal = document.getElementById('cropWarningModal');
    const confirmCropBtn = document.getElementById('confirmCrop');
    const cancelCropWarningBtn = document.getElementById('cancelCropWarning');

    // Prevent crop button from collapsing when clicked
    cropBtn.addEventListener('click', function(event) {
        // Prevent event propagation to parent elements
        event.stopPropagation();
        
        // Show warning modal first
        cropWarningModal.style.display = 'flex';
    });

    // Confirm crop after warning
    confirmCropBtn.addEventListener('click', function() {
        // Hide the warning modal
        cropWarningModal.style.display = 'none';
        
        const canvas = document.getElementById('outputCanvas');
        
        // If the cropper is already active, destroy it
        if (cropper) {
            cropper.destroy();
            cropper = null;
            cropContainer.style.display = 'none';
            cropBtn.classList.remove('active');
            return;
        }
        
        // Initialize cropping
        cropBtn.classList.add('active');
        cropContainer.style.display = 'block';
        
        // Initialize Cropper.js on the canvas
        cropper = new Cropper(canvas, {
            viewMode: 1,             // Restrict the crop box to not exceed the size of the canvas
            dragMode: 'crop',        // Set dragMode to 'crop' to ensure the handles work correctly
            aspectRatio: NaN,        // Free aspect ratio
            autoCropArea: 1,         // The initial crop area will be the entire image
            movable: true,           // Allow moving the canvas and crop box
            rotatable: false,        // Disable rotation for simplicity
            scalable: false,         // Disable scaling for simplicity
            zoomable: true,          // Allow zooming
            zoomOnTouch: true,       // Allow zoom on touch devices
            zoomOnWheel: true,       // Allow zoom on wheel
            cropBoxMovable: true,    // Allow the crop box to be moved
            cropBoxResizable: true,  // Allow the crop box to be resized
            toggleDragModeOnDblclick: true,  // Toggle between "crop" and "move" on double click
            minContainerWidth: 100,  // Ensure container is at least this wide
            minContainerHeight: 100, // Ensure container is at least this tall
            background: false,       // Disable checkerboard background
            guides: true,            // Show guides
            center: true,            // Show center indicator
            highlight: true,         // Enable white highlight in the crop box for better visibility
            modal: true,             // Enable the black modal behind the crop box
            ready: function() {
                // When cropper is ready, ensure crop controls are visible
                cropContainer.style.display = 'block';
                
                // Force update to ensure correct positioning
                setTimeout(function() {
                    if (cropper) {
                        cropper.crop();
                    }
                }, 100);
            }
        });
    });

    // Cancel crop warning
    cancelCropWarningBtn.addEventListener('click', function() {
        cropWarningModal.style.display = 'none';
    });

    // Apply crop
    applyCropBtn.addEventListener('click', function() {
        if (!cropper) return;
        
        // Show loading overlay
        document.getElementById('loadingOverlay').style.display = 'flex';
        
        // Get the cropped canvas
        const croppedCanvas = cropper.getCroppedCanvas({
            imageSmoothingEnabled: false,
            imageSmoothingQuality: 'high'
        });
        
        // Get the main canvas and its context
        const canvas = document.getElementById('outputCanvas');
        const ctx = canvas.getContext('2d');
        
        // Resize the main canvas to match the cropped canvas
        canvas.width = croppedCanvas.width;
        canvas.height = croppedCanvas.height;
        
        // Draw the cropped canvas onto the main canvas
        ctx.drawImage(croppedCanvas, 0, 0);
        
        // Update the original image to be the cropped one
        const croppedImage = new Image();
        croppedImage.crossOrigin = "Anonymous"; // Ensure we can work with the image data
        
        croppedImage.onload = function() {
            // Replace the original image with the cropped one
            originalImage = croppedImage;
            
            // Create a temporary canvas to extract pure image data
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = croppedImage.width;
            tempCanvas.height = croppedImage.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Draw the new image on the temp canvas
            tempCtx.drawImage(croppedImage, 0, 0, croppedImage.width, croppedImage.height);
            
            // Store the pure image data - this ensures we have the right color information
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Reset zoom/transform
            resetTransform();
            
            // Instead of re-applying dithering, mark the image as "frozen" for export
            // Add accent outline to indicate frozen state
            canvas.style.outline = `3px solid var(--primary)`;
            canvas.style.outlineOffset = '-3px';
            canvas.classList.add('frozen-for-export');
            
            // Add an event listener to the algorithm select to remove frozen state when changed
            const algorithmSelect = document.getElementById('algorithm');
            const eventHandler = function() {
                if (canvas.classList.contains('frozen-for-export')) {
                    canvas.style.outline = 'none';
                    canvas.classList.remove('frozen-for-export');
                    // Remove this event listener
                    algorithmSelect.removeEventListener('change', eventHandler);
                    
                    // Also remove from category buttons
                    const categoryBtns = document.querySelectorAll('.category-btn, .algo-btn, .color-mode-btn');
                    categoryBtns.forEach(btn => {
                        btn.removeEventListener('click', eventHandler);
                    });
                    
                    // Process the image with new algorithm
                    processImage();
                }
            };
            
            // Add the event listener to algorithm selection
            algorithmSelect.addEventListener('change', eventHandler);
            
            // Also add to algorithm category buttons and algorithm buttons
            const categoryBtns = document.querySelectorAll('.category-btn, .algo-btn, .color-mode-btn');
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', eventHandler);
            });
            
            // Also add to any slider control that would change the image
            const imageSliders = document.querySelectorAll('input[type="range"]');
            imageSliders.forEach(slider => {
                slider.addEventListener('input', eventHandler);
            });
            
            // Hide loading overlay
            document.getElementById('loadingOverlay').style.display = 'none';
            
            // Show notification
            showNotification('Image cropped successfully! Ready for export.');
        };
        
        // Set the source to the cropped canvas image
        croppedImage.src = croppedCanvas.toDataURL('image/png');
        
        // Clean up and exit crop mode
        cropper.destroy();
        cropper = null;
        cropContainer.style.display = 'none';
        cropBtn.classList.remove('active');
    });

    // Cancel crop
    cancelCropBtn.addEventListener('click', function() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        cropContainer.style.display = 'none';
        cropBtn.classList.remove('active');
    });

    // Clean up the cropper when switching between PNG and SVG views
    pngToggle.addEventListener('click', function() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
            cropContainer.style.display = 'none';
            cropBtn.classList.remove('active');
        }
    });

    svgToggle.addEventListener('click', function() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
            cropContainer.style.display = 'none';
            cropBtn.classList.remove('active');
        }
    });

    // Dithering info modal functionality
    const infoBtn = document.getElementById('infoBtn');
    const ditherInfoModal = document.getElementById('ditherInfoModal');
    const closeInfoModalBtn = document.getElementById('closeInfoModal');

    // Show the info modal when the info button is clicked
    infoBtn.addEventListener('click', function(event) {
        // Prevent event propagation to avoid collapsing the panel
        event.stopPropagation();
        showInfoModal();
    });

    // Hide the info modal when the close button is clicked
    closeInfoModalBtn.addEventListener('click', function() {
        closeInfoModal();
    });

    // Also close the modal when clicking outside the content
    ditherInfoModal.addEventListener('click', function(event) {
        if (event.target === ditherInfoModal) {
            closeInfoModal();
        }
    });

    // Close modal when ESC key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && ditherInfoModal.style.display === 'flex') {
            closeInfoModal();
        }
    });

    // Fix modal display during fullscreen changes
    document.addEventListener('fullscreenchange', function() {
        if (ditherInfoModal.style.display === 'flex') {
            // Re-show the modal after fullscreen change
            setTimeout(function() {
                if (document.fullscreenElement || 
                    document.webkitFullscreenElement || 
                    document.mozFullScreenElement ||
                    document.msFullscreenElement) {
                    ditherInfoModal.style.position = 'fixed';
                    ditherInfoModal.style.zIndex = '999999';
                }
                ditherInfoModal.style.display = 'flex';
            }, 100);
        }
    });

    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    function handleFullScreenChange() {
        if (ditherInfoModal.style.display === 'flex') {
            setTimeout(function() {
                ditherInfoModal.style.display = 'flex';
            }, 100);
        }
    }

    // Add event listener for Extra Crush checkbox
    const extraCrush = document.getElementById('extraCrush');
    extraCrush.addEventListener('change', processImage);

    // Video export functionality
    const videoExportToggle = document.getElementById('videoExportToggle');
    const videoExportSection = document.getElementById('videoExportSection');
    const takeSnapshotBtn = document.getElementById('takeSnapshotBtn');
    const snapshotContainer = document.getElementById('snapshotContainer');
    const frameSpeedInput = document.getElementById('frameSpeed');
    const sortFramesBtn = document.getElementById('sortFramesBtn');
    const reverseFramesBtn = document.getElementById('reverseFramesBtn');
    const clearFramesBtn = document.getElementById('clearFramesBtn');
    const exportMP4Btn = document.getElementById('exportMP4');
    
    // Frame storage
    let frames = [];
    let sortable;
    
    // Toggle video export section visibility
    videoExportToggle.addEventListener('change', function() {
        videoExportSection.style.display = this.checked ? 'block' : 'none';
        
        // Initialize Sortable.js when section is first shown
        if (this.checked && !sortable) {
            initSortable();
        }
    });
    
    // Initialize sortable for drag-and-drop reordering
    function initSortable() {
        if (!snapshotContainer) return;
        
        // Initialize Sortable.js
        new Sortable(snapshotContainer, {
            animation: 150,
            ghostClass: 'snapshot-ghost',
            onEnd: updateFrameNumbers
        });
    }
    
    // Update the snapshot gallery with current frames
    function updateSnapshotGallery() {
        if (!snapshotContainer) return;
        
        // Remove any existing empty state message if we have frames
        if (frames.length > 0) {
            const emptyState = snapshotContainer.querySelector('.empty-state');
            if (emptyState) {
                emptyState.remove();
            }
            
            // Add grid layout class to snapshot container
            snapshotContainer.classList.add('grid-layout');
        } else {
            // If no frames, add empty state message and reset styles
            snapshotContainer.classList.remove('grid-layout');
            
            // Only add empty state if it doesn't exist
            if (!snapshotContainer.querySelector('.empty-state')) {
                const emptyStateDiv = document.createElement('div');
                emptyStateDiv.className = 'empty-state';
                emptyStateDiv.textContent = 'No frames added yet';
                snapshotContainer.appendChild(emptyStateDiv);
            }
        }
    }
    
    // Update frame numbers after reordering
    function updateFrameNumbers() {
        if (!snapshotContainer) return;
        
        // Get all thumbnails and update their frame numbers and data indices
        const thumbnails = snapshotContainer.querySelectorAll('.snapshot-thumbnail');
        
        // Update frames array to match new order
        const newFrames = [];
        
        thumbnails.forEach((thumbnail, index) => {
            // Update frame number display
            const frameNumber = thumbnail.querySelector('.frame-number');
            if (frameNumber) {
                frameNumber.textContent = (index + 1).toString();
            }
            
            // Update data index
            const oldIndex = parseInt(thumbnail.dataset.index);
            thumbnail.dataset.index = index;
            
            // Add to new frames array in correct order
            if (frames[oldIndex]) {
                // Keep the originalIndex property but update position
                const updatedFrame = frames[oldIndex];
                newFrames.push(updatedFrame);
            }
        });
        
        // Replace frames array with reordered array
        frames = newFrames;
    }
    
    // Take a snapshot of the current canvas
    takeSnapshotBtn.addEventListener('click', function() {
        if (!originalImage) {
            showNotification('No image loaded', true);
            return;
        }
        
        if (!snapshotContainer) return;
        
        // Create a new thumbnail
        const thumbnail = document.createElement('div');
        thumbnail.className = 'snapshot-thumbnail';
        thumbnail.dataset.index = frames.length;
        
        // Add the snapshot image
        const img = document.createElement('img');
        img.src = outputCanvas.toDataURL('image/png');
        thumbnail.appendChild(img);
        
        // Add frame number
        const frameNumber = document.createElement('div');
        frameNumber.className = 'frame-number';
        frameNumber.textContent = frames.length + 1;
        thumbnail.appendChild(frameNumber);
        
        // Add delete button
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'delete-frame';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            thumbnail.remove();
            frames.splice(parseInt(thumbnail.dataset.index), 1);
            updateFrameNumbers();
            updateSnapshotGallery();
        });
        thumbnail.appendChild(deleteBtn);
        
        // Add to the container and frames array
        snapshotContainer.appendChild(thumbnail);
        
        // Store the frame data with originalIndex
        frames.push({
            src: img.src,
            canvas: outputCanvas.toDataURL('image/png'),
            originalIndex: frames.length  // Store the original index for "Default Order" sorting
        });
        
        // Update UI
        updateSnapshotGallery();
        
        // Show notification
        showNotification('Frame added!');
    });
    
    clearFramesBtn.addEventListener('click', function() {
        if (!snapshotContainer) return;
        if (frames.length === 0) return;
        
        // Clear all thumbnails
        frames = [];
        while (snapshotContainer.firstChild) {
            snapshotContainer.removeChild(snapshotContainer.firstChild);
        }
        
        // Add empty state message back
        updateSnapshotGallery();
        
        // Show notification
        showNotification('All frames cleared');
    });
    
    // Export as MP4
    exportMP4Btn.addEventListener('click', async function() {
        if (frames.length === 0) {
            showNotification('No frames to export', true);
            return;
        }
        
        // Show loading overlay
        loadingOverlay.classList.add('active');
        showNotification('Creating MP4, please wait...', false);
        
        try {
            // Get fps from input
            const fps = parseInt(frameSpeedInput.value) || 10; // Default to 10 fps if invalid
            const frameDuration = 1000 / fps; // Duration of each frame in ms
            
            // Get loop count from input
            const loopCount = parseInt(document.getElementById('loopCount').value) || 1;
            
            // Create a temporary canvas for the video
            const videoCanvas = document.createElement('canvas');
            
            // Set canvas dimensions from the first frame
            const firstImg = new Image();
            firstImg.src = frames[0].src;
            
            await new Promise((resolve) => {
                firstImg.onload = resolve;
            });
            
            // Set canvas size to match first frame
            videoCanvas.width = firstImg.width;
            videoCanvas.height = firstImg.height;
            const ctx = videoCanvas.getContext('2d', { alpha: true }); // Enable alpha channel for transparency
            
            // We'll use a fixed framerate stream with explicit FPS value
            const stream = videoCanvas.captureStream(fps);
            
            // Force timestamp generation and better quality
            const videoTracks = stream.getVideoTracks();
            if (videoTracks.length > 0) {
                const videoTrack = videoTracks[0];
                videoTrack.contentHint = "detail"; // Higher quality setting
            }
            
            // Get the MIME type with the best quality available in the browser
            const mimeTypes = [
                'video/webm;codecs=vp9',  // Highest quality
                'video/webm;codecs=vp8',
                'video/webm',
                'video/mp4;codecs=h264',  // Fallback
                'video/mp4'
            ];
            
            let selectedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
            
            // Initialize MediaRecorder with better codec options
            const recorder = new MediaRecorder(stream, {
                mimeType: selectedMimeType,
                videoBitsPerSecond: 35000000 // 25 Mbps for highest quality
            });
            
            // Array to store chunks of recorded video
            const chunks = [];
            
            // Add data to chunks when available
            recorder.ondataavailable = function(e) {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };
            
            // Handle recording completion
            recorder.onstop = function() {
                // Hide loading overlay
                loadingOverlay.classList.remove('active');
                
                // Create final video blob
                const blob = new Blob(chunks, { 
                    type: 'video/mp4' 
                });
                
                // Create download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dither_animation_${new Date().getTime()}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Clean up
                URL.revokeObjectURL(url);
                
                showNotification('MP4 export completed!', false);
            };
            
            // Start recording with frequent data requests for better metadata
            recorder.start(40); // Request data every 40ms for better seeking
            
            // Preload all the images before we start drawing frames
            const images = [];
            
            // Load all images
            await Promise.all(frames.map(async (frame, index) => {
                const img = new Image();
                await new Promise(resolve => {
                    img.onload = resolve;
                    img.src = frame.src;
                });
                images.push(img);
                
                // Update loading progress
                const loadProgress = Math.round((index + 1) / frames.length * 50); // Up to 50%
                showNotification(`Loading frames: ${loadProgress}%`, false);
            }));
            
            // Calculate total frames to process
            const totalFrameCount = frames.length * loopCount;
            
            // Draw black background for first frame
            ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
            ctx.drawImage(images[0], 0, 0, videoCanvas.width, videoCanvas.height);
            
            // Wait for the stream to initialize
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Process all frames
            let frameIndex = 0;
            let currentLoop = 0;
            let frameStart = performance.now();
            let processedFrames = 0;
            
            // Create a function that returns a promise for the next frame
            const drawFrame = async () => {
                // Get current frame index
                const imageIndex = frameIndex % frames.length;
                const overallFrameIndex = currentLoop * frames.length + frameIndex;
                
                // Check if we're done
                if (overallFrameIndex >= totalFrameCount) {
                    // Wait a bit longer to ensure last frame is captured
                    await new Promise(resolve => setTimeout(resolve, frameDuration * 3));
                    recorder.stop();
                    return;
                }
                
                // Update progress (50-100%)
                const progress = 50 + Math.round((overallFrameIndex + 1) / totalFrameCount * 50);
                showNotification(`Processing MP4: ${progress}%`, false);
                
                // Draw frame with high quality
                ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
                ctx.imageSmoothingEnabled = false; // Keep pixel art crisp
                ctx.drawImage(images[imageIndex], 0, 0, videoCanvas.width, videoCanvas.height);
                
                // Force a frame commit using requestVideoFrameCallback if available
                await new Promise(resolve => {
                    if (videoCanvas.requestVideoFrameCallback) {
                        videoCanvas.requestVideoFrameCallback(resolve);
                    } else {
                        // Fallback timing
                        setTimeout(resolve, 10);
                    }
                });
                
                // Calculate exact timing for next frame
                const now = performance.now();
                const elapsed = now - frameStart;
                const targetTime = (processedFrames + 1) * frameDuration;
                const delay = Math.max(0, targetTime - elapsed);
                
                // Schedule next frame
                await new Promise(resolve => setTimeout(resolve, delay));
                
                // Advance to next frame
                frameIndex++;
                processedFrames++;
                
                // Check for loop end
                if (frameIndex >= frames.length) {
                    frameIndex = 0;
                    currentLoop++;
                }
                
                // Process next frame
                await drawFrame();
            };
            
            // Start the frame processing
            await drawFrame();
            
        } catch (error) {
            // Handle errors
            console.error('MP4 export error:', error);
            loadingOverlay.classList.remove('active');
            showNotification('MP4 export failed: ' + error.message, true);
        }
    });
    
    // Export as WebM
    const exportWebMBtn = document.getElementById('exportWebM');
    exportWebMBtn.addEventListener('click', async function() {
        if (frames.length === 0) {
            showNotification('No frames to export', true);
            return;
        }
        
        // Show loading overlay
        loadingOverlay.classList.add('active');
        showNotification('Creating WebM, please wait...', false);
        
        try {
            // Get fps from input
            const fps = parseInt(frameSpeedInput.value) || 10; // Default to 10 fps if invalid
            const frameDuration = 1000 / fps; // Duration of each frame in ms
            
            // Get loop count from input
            const loopCount = parseInt(document.getElementById('loopCount').value) || 1;
            
            // Create a temporary canvas for the video
            const videoCanvas = document.createElement('canvas');
            
            // Set canvas dimensions from the first frame
            const firstImg = new Image();
            firstImg.src = frames[0].src;
            
            await new Promise((resolve) => {
                firstImg.onload = resolve;
            });
            
            // Set canvas size to match first frame
            videoCanvas.width = firstImg.width;
            videoCanvas.height = firstImg.height;
            const ctx = videoCanvas.getContext('2d', { alpha: true }); // Enable alpha channel for transparency
            
            // We'll use a fixed framerate stream with explicit FPS value
            const stream = videoCanvas.captureStream(fps);
            
            // Force timestamp generation and better quality
            const videoTracks = stream.getVideoTracks();
            if (videoTracks.length > 0) {
                const videoTrack = videoTracks[0];
                videoTrack.contentHint = "detail"; // Higher quality setting
            }
            
            // Get optimal WebM codec
            let mimeType = 'video/webm;codecs=vp9'; // Best quality
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm;codecs=vp8'; // Fallback
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/webm'; // Last resort
                }
            }
            
            // Initialize MediaRecorder with WebM codec options
            const recorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                videoBitsPerSecond: 35000000 // 25 Mbps for highest quality
            });
            
            // Array to store chunks of recorded video
            const chunks = [];
            
            // Add data to chunks when available
            recorder.ondataavailable = function(e) {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };
            
            // Handle recording completion
            recorder.onstop = function() {
                // Hide loading overlay
                loadingOverlay.classList.remove('active');
                
                // Create final video blob with the WebM MIME type
                const blob = new Blob(chunks, { 
                    type: 'video/webm'
                });
                
                // Create download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dither_animation_${new Date().getTime()}.webm`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Clean up
                URL.revokeObjectURL(url);
                
                showNotification('WebM export completed!', false);
            };
            
            // Start recording with frequent data requests for better metadata
            recorder.start(40); // Request data every 40ms for better seeking
            
            // Preload all the images before we start drawing frames
            const images = [];
            
            // Load all images
            await Promise.all(frames.map(async (frame, index) => {
                const img = new Image();
                await new Promise(resolve => {
                    img.onload = resolve;
                    img.src = frame.src;
                });
                images.push(img);
                
                // Update loading progress
                const loadProgress = Math.round((index + 1) / frames.length * 50); // Up to 50%
                showNotification(`Loading frames: ${loadProgress}%`, false);
            }));
            
            // Calculate total frames to process
            const totalFrameCount = frames.length * loopCount;
            
            // Draw black background for first frame
            ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
            ctx.drawImage(images[0], 0, 0, videoCanvas.width, videoCanvas.height);
            
            // Wait for the stream to initialize
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Process all frames
            let frameIndex = 0;
            let currentLoop = 0;
            let frameStart = performance.now();
            let processedFrames = 0;
            
            // Create a function that returns a promise for the next frame
            const drawFrame = async () => {
                // Get current frame index
                const imageIndex = frameIndex % frames.length;
                const overallFrameIndex = currentLoop * frames.length + frameIndex;
                
                // Check if we're done
                if (overallFrameIndex >= totalFrameCount) {
                    // Wait a bit longer to ensure last frame is captured
                    await new Promise(resolve => setTimeout(resolve, frameDuration * 3));
                    recorder.stop();
                    return;
                }
                
                // Update progress (50-100%)
                const progress = 50 + Math.round((overallFrameIndex + 1) / totalFrameCount * 50);
                showNotification(`Processing WebM: ${progress}%`, false);
                
                // Draw frame with high quality
                ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
                ctx.imageSmoothingEnabled = false; // Keep pixel art crisp
                ctx.drawImage(images[imageIndex], 0, 0, videoCanvas.width, videoCanvas.height);
                
                // Force a frame commit using requestVideoFrameCallback if available
                await new Promise(resolve => {
                    if (videoCanvas.requestVideoFrameCallback) {
                        videoCanvas.requestVideoFrameCallback(resolve);
                    } else {
                        // Fallback timing
                        setTimeout(resolve, 10);
                    }
                });
                
                // Calculate exact timing for next frame
                const now = performance.now();
                const elapsed = now - frameStart;
                const targetTime = (processedFrames + 1) * frameDuration;
                const delay = Math.max(0, targetTime - elapsed);
                
                // Schedule next frame
                await new Promise(resolve => setTimeout(resolve, delay));
                
                // Advance to next frame
                frameIndex++;
                processedFrames++;
                
                // Check for loop end
                if (frameIndex >= frames.length) {
                    frameIndex = 0;
                    currentLoop++;
                }
                
                // Process next frame
                await drawFrame();
            };
            
            // Start the frame processing
            await drawFrame();
            
        } catch (error) {
            // Handle errors
            console.error('WebM export error:', error);
            loadingOverlay.classList.remove('active');
            showNotification('WebM export failed: ' + error.message, true);
        }
    });
    
    // Export as ZIP (image sequence)
    const exportZIPBtn = document.getElementById('exportZIP');
    exportZIPBtn.addEventListener('click', async function() {
        if (frames.length === 0) {
            showNotification('No frames to export', true);
            return;
        }
        
        // Show loading overlay
        loadingOverlay.classList.add('active');
        showNotification('Creating ZIP with image sequence, please wait...', false);
        
        try {
            // Get loop count from input
            const loopCount = parseInt(document.getElementById('loopCount').value) || 1;
            
            // Create a new JSZip instance
            const zip = new JSZip();
            const imgFolder = zip.folder("frames");
            
            // Process all frames
            let processed = 0;
            // Calculate total frames with loops (exact count)
            const totalFrames = frames.length * loopCount;
            
            // Function to fetch image as blob
            const fetchImageAsBlob = async (src) => {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', src, true);
                    xhr.responseType = 'blob';
                    xhr.onload = function() {
                        if (this.status === 200) {
                            resolve(this.response);
                        } else {
                            reject(new Error('Failed to load image'));
                        }
                    };
                    xhr.onerror = reject;
                    xhr.send();
                });
            };
            
            // Add all images to the zip file with loops
            const promises = [];
            
            // Create a map of blobs to avoid fetching the same image multiple times
            const blobCache = new Map();
            
            // Process each loop
            for (let loop = 0; loop < loopCount; loop++) {
                // Process each frame in the current loop
                for (let index = 0; index < frames.length; index++) {
                    const frame = frames[index];
                    const frameUrl = frame.src;
                    const overallIndex = (loop * frames.length) + index;
                    
                    // Create a promise for each frame
                    const promise = (async () => {
                        try {
                            let blob;
                            
                            // Check if we already have this blob in the cache
                            if (blobCache.has(frameUrl)) {
                                blob = blobCache.get(frameUrl);
                            } else {
                                // Get blob from data URL
                                blob = await fetchImageAsBlob(frameUrl);
                                blobCache.set(frameUrl, blob);
                            }
                            
                            // Add to zip with sequential naming (padding with zeros)
                            // Use overallIndex for continuous numbering across loops
                            const paddedIndex = String(overallIndex + 1).padStart(4, '0');
                            imgFolder.file(`frame_${paddedIndex}.png`, blob);
                            
                            // Update progress
                            processed++;
                            const progress = Math.round(processed / totalFrames * 100);
                            showNotification(`Adding images to ZIP: ${progress}%`, false);
                        } catch (err) {
                            console.error('Error processing frame:', err);
                        }
                    })();
                    
                    promises.push(promise);
                }
            }
            
            // Wait for all frames to be processed
            await Promise.all(promises);
            
            // Generate the zip file
            showNotification('Generating ZIP file...', false);
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 6 // Medium compression level
                }
            }, (metadata) => {
                const progress = Math.round(metadata.percent);
                showNotification(`Compressing ZIP: ${progress}%`, false);
            });
            
            // Create download link for the zip
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dither_frames_${new Date().getTime()}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            // Hide loading overlay
            loadingOverlay.classList.remove('active');
            showNotification('ZIP export completed!', false);
            
        } catch (error) {
            // Handle errors
            console.error('ZIP export error:', error);
            loadingOverlay.classList.remove('active');
            showNotification('ZIP export failed: ' + error.message, true);
        }
    });

    // Setup input field event listeners for all slider value inputs
    function setupInputFieldListeners() {
        // Create pairs of slider and input field elements
        const sliderPairs = [
            { slider: contrast, input: contrastValue, unit: '', min: -100, max: 100, step: 1 },
            { slider: brightness, input: brightnessValue, unit: '', min: -100, max: 100, step: 1 },
            { slider: threshold, input: thresholdValue, unit: '', min: 0, max: 255, step: 1 },
            { slider: ditherAmount, input: ditherAmountValue, unit: '', min: 0, max: 100, step: 1 },
            { slider: blockSize, input: blockSizeValue, unit: '%', min: 1, max: 100, step: 1 },
            { slider: blackPoint, input: blackPointValue, unit: '', min: 0, max: 254, step: 1 },
            { slider: midPoint, input: midPointValue, unit: '', min: 1, max: 254, step: 1 },
            { slider: whitePoint, input: whitePointValue, unit: '', min: 1, max: 255, step: 1 },
            { slider: saturation, input: saturationValue, unit: '%', min: 0, max: 100, step: 1 },
            { slider: hue, input: hueValue, unit: '°', min: 0, max: 360, step: 1 },
            { slider: pixelSortThreshold, input: pixelSortThresholdValue, unit: '', min: 0, max: 255, step: 1 },
            { slider: pixelSortAmount, input: pixelSortAmountValue, unit: '', min: 0, max: 100, step: 1 },
        ];
        
        // Add event listeners for algorithm-specific sliders
        if (document.getElementById('bitDepth')) {
            sliderPairs.push({ 
                slider: document.getElementById('bitDepth'), 
                input: document.getElementById('bitDepthValue'), 
                unit: '', min: 1, max: 8, step: 1 
            });
        }
        
        if (document.getElementById('mosaicSize')) {
            sliderPairs.push({ 
                slider: document.getElementById('mosaicSize'), 
                input: document.getElementById('mosaicSizeValue'),
                unit: '', min: 2, max: 16, step: 1 
            });
        }
        
        if (document.getElementById('patternSize')) {
            sliderPairs.push({ 
                slider: document.getElementById('patternSize'), 
                input: document.getElementById('patternSizeValue'),
                unit: '', min: 0.5, max: 100, step: 0.5 
            });
        }
        
        if (document.getElementById('patternAngle')) {
            sliderPairs.push({ 
                slider: document.getElementById('patternAngle'), 
                input: document.getElementById('patternAngleValue'),
                unit: '°', min: 0, max: 360, step: 15 
            });
        }
        
        if (document.getElementById('sineWaveLength')) {
            sliderPairs.push({ 
                slider: document.getElementById('sineWaveLength'), 
                input: document.getElementById('sineWaveLengthValue'),
                unit: '', min: 5, max: 100, step: 1 
            });
        }
        
        if (document.getElementById('sineWaveAmplitude')) {
            sliderPairs.push({ 
                slider: document.getElementById('sineWaveAmplitude'), 
                input: document.getElementById('sineWaveAmplitudeValue'),
                unit: '', min: 1, max: 50, step: 1 
            });
        }
        
        if (document.getElementById('sineWaveThickness')) {
            sliderPairs.push({ 
                slider: document.getElementById('sineWaveThickness'), 
                input: document.getElementById('sineWaveThicknessValue'),
                unit: '', min: 1, max: 10, step: 0.5 
            });
        }
        
        if (document.getElementById('sineWaveCount')) {
            sliderPairs.push({ 
                slider: document.getElementById('sineWaveCount'), 
                input: document.getElementById('sineWaveCountValue'),
                unit: '', min: 1, max: 25, step: 2 
            });
        }
        
        if (document.getElementById('sineWaveDistance')) {
            sliderPairs.push({ 
                slider: document.getElementById('sineWaveDistance'), 
                input: document.getElementById('sineWaveDistanceValue'),
                unit: '', min: 10, max: 100, step: 5 
            });
        }
        
        if (document.getElementById('sineWaveRotation')) {
            sliderPairs.push({ 
                slider: document.getElementById('sineWaveRotation'), 
                input: document.getElementById('sineWaveRotationValue'),
                unit: '°', min: 0, max: 360, step: 15 
            });
        }
        
        if (document.getElementById('waveLength')) {
            sliderPairs.push({ 
                slider: document.getElementById('waveLength'), 
                input: document.getElementById('waveLengthValue'),
                unit: '', min: 4, max: 64, step: 4 
            });
        }
        
        if (document.getElementById('waveAmplitude')) {
            sliderPairs.push({ 
                slider: document.getElementById('waveAmplitude'), 
                input: document.getElementById('waveAmplitudeValue'),
                unit: '', min: 1, max: 32, step: 1 
            });
        }
        
        // For each pair, add input change and blur event listeners
        sliderPairs.forEach(pair => {
            if (pair.input && pair.slider) {
                // Add change and blur events
                pair.input.addEventListener('change', function() {
                    updateSliderFromInput(pair);
                });
                
                pair.input.addEventListener('blur', function() {
                    updateSliderFromInput(pair);
                });
                
                // Add keydown event for Enter key
                pair.input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        updateSliderFromInput(pair);
                        this.blur(); // Remove focus after pressing Enter
                    }
                });
            }
        });
    }
    
    // Update slider from input field value
    function updateSliderFromInput(pair) {
        let value = pair.input.value;
        
        // Remove any unit suffix (%, °, etc.)
        if (pair.unit) {
            value = value.replace(pair.unit, '');
        }
        
        // Parse as float first for decimal support
        value = parseFloat(value);
        
        // Validate value is within range
        if (isNaN(value)) {
            // Reset to current slider value if input is not a number
            pair.input.value = pair.slider.value + pair.unit;
            return;
        }
        
        // Clamp value to min/max range
        value = Math.min(Math.max(value, pair.min), pair.max);
        
        // Apply step constraints when needed
        if (pair.step !== 1) {
            // Round to nearest step
            value = Math.round(value / pair.step) * pair.step;
            // Fix floating point precision issues
            value = parseFloat(value.toFixed(10));
        }
        
        // Update slider value
        pair.slider.value = value;
        
        // Update input value with formatted value
        pair.input.value = value + pair.unit;
        
        // Process the image with the new value
        processImageWithDelay();
    }

    function togglePixelSortControls() {
        if (pixelSortToggle.checked) {
            pixelSortControls.style.display = 'block';
        } else {
            pixelSortControls.style.display = 'none';
        }
        processImage();
    }
    
    function updatePixelSortThresholdValue() {
        pixelSortThresholdValue.value = pixelSortThreshold.value;
        processImage();
    }
    
    function updatePixelSortAmountValue() {
        pixelSortAmountValue.value = pixelSortAmount.value;
        processImage();
    }

    // Add the pixel sort function
    function applyPixelSort(imageData, direction, threshold, amount, width, height) {
        // Convert imageData to an array of pixels
        const pixels = [];
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const a = imageData.data[i + 3];
            
            // Calculate values for different sort criteria
            const brightness = (r + g + b) / 3;
            
            // Calculate hue (0-360)
            let hue = 0;
            const min = Math.min(r, g, b);
            const max = Math.max(r, g, b);
            const delta = max - min;
            
            if (delta === 0) {
                hue = 0; // Grayscale
            } else if (max === r) {
                hue = ((g - b) / delta) % 6;
            } else if (max === g) {
                hue = (b - r) / delta + 2;
            } else {
                hue = (r - g) / delta + 4;
            }
            
            hue = Math.round(hue * 60);
            if (hue < 0) hue += 360;
            
            // Calculate saturation (0-100)
            const saturation = max === 0 ? 0 : Math.round((delta / max) * 100);
            
            pixels.push({ r, g, b, a, brightness, hue, saturation, index: i / 4 });
        }
        
        // For gradient calculation, we need to precompute gradient magnitude for each pixel
        if (currentSortCriteria === 'gradient') {
            // Calculate gradient magnitude using Sobel operator
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x;
                    let gx = 0;
                    let gy = 0;
                    
                    // Apply 3x3 Sobel operator
                    if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
                        // Horizontal gradient
                        gx = (
                            -1 * pixels[(y-1) * width + (x-1)].brightness +
                            -2 * pixels[y * width + (x-1)].brightness +
                            -1 * pixels[(y+1) * width + (x-1)].brightness +
                            1 * pixels[(y-1) * width + (x+1)].brightness +
                            2 * pixels[y * width + (x+1)].brightness +
                            1 * pixels[(y+1) * width + (x+1)].brightness
                        );
                        
                        // Vertical gradient
                        gy = (
                            -1 * pixels[(y-1) * width + (x-1)].brightness +
                            -2 * pixels[(y-1) * width + x].brightness +
                            -1 * pixels[(y-1) * width + (x+1)].brightness +
                            1 * pixels[(y+1) * width + (x-1)].brightness +
                            2 * pixels[(y+1) * width + x].brightness +
                            1 * pixels[(y+1) * width + (x+1)].brightness
                        );
                    }
                    
                    // Calculate gradient magnitude
                    pixels[idx].gradient = Math.sqrt(gx * gx + gy * gy);
                }
            }
        }
        
        // Function to get sort value based on current criteria
        const getSortValue = (pixel) => {
            switch (currentSortCriteria) {
                case 'brightness': return pixel.brightness;
                case 'hue': return pixel.hue;
                case 'red': return pixel.r;
                case 'green': return pixel.g;
                case 'blue': return pixel.b;
                case 'gradient': return pixel.gradient || 0;
                default: return pixel.brightness;
            }
        };
        
        // Remap threshold for gradient mode to make it more sensitive
        let effectiveThreshold = threshold;
        if (currentSortCriteria === 'gradient') {
            // Map the threshold from 0-255 range to 0-150 range
            effectiveThreshold = Math.max(0, 150 * (threshold / 255));
        }
        
        if (direction === 'horizontal' || direction === 'both') {
            // Sort pixels horizontally (by row)
            for (let y = 0; y < height; y++) {
                let row = [];
                let sortSegment = [];
                
                // Extract row of pixels
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x;
                    row.push(pixels[idx]);
                }
                
                // Process each row based on threshold
                let sortingPixels = false;
                for (let x = 0; x < width; x++) {
                    const pixel = row[x];
                    const pixelValue = getSortValue(pixel);
                    
                    // Check if this pixel's value crosses the threshold
                    if (!sortingPixels && pixelValue > effectiveThreshold) {
                        // Start collecting pixels to sort
                        sortingPixels = true;
                        sortSegment = [pixel];
                    } else if (sortingPixels && (pixelValue <= effectiveThreshold || x === width - 1)) {
                        // End of a segment to sort
                        if (x === width - 1 && pixelValue > effectiveThreshold) {
                            sortSegment.push(pixel);
                        }
                        
                        // Only sort if we have a segment and random chance based on amount
                        if (sortSegment.length > 1 && Math.random() < amount) {
                            // Sort the segment by the selected criteria
                            sortSegment.sort((a, b) => getSortValue(a) - getSortValue(b));
                            
                            // Apply the sorted segment back to the row
                            let idx = x - sortSegment.length;
                            if (x === width - 1 && pixelValue > effectiveThreshold) {
                                idx++;
                            }
                            
                            for (let j = 0; j < sortSegment.length; j++) {
                                row[idx + j] = sortSegment[j];
                            }
                        }
                        
                        sortingPixels = false;
                        sortSegment = [];
                    } else if (sortingPixels) {
                        // Add to current segment
                        sortSegment.push(pixel);
                    }
                }
                
                // Write the row back to the pixels array
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x;
                    pixels[idx] = row[x];
                }
            }
        }
        
        if (direction === 'vertical' || direction === 'both') {
            // Sort pixels vertically (by column)
            for (let x = 0; x < width; x++) {
                let column = [];
                let sortSegment = [];
                
                // Extract column of pixels
                for (let y = 0; y < height; y++) {
                    const idx = y * width + x;
                    column.push(pixels[idx]);
                }
                
                // Process each column based on threshold
                let sortingPixels = false;
                for (let y = 0; y < height; y++) {
                    const pixel = column[y];
                    const pixelValue = getSortValue(pixel);
                    
                    // Check if this pixel's value crosses the threshold
                    if (!sortingPixels && pixelValue > effectiveThreshold) {
                        // Start collecting pixels to sort
                        sortingPixels = true;
                        sortSegment = [pixel];
                    } else if (sortingPixels && (pixelValue <= effectiveThreshold || y === height - 1)) {
                        // End of a segment to sort
                        if (y === height - 1 && pixelValue > effectiveThreshold) {
                            sortSegment.push(pixel);
                        }
                        
                        // Only sort if we have a segment and random chance based on amount
                        if (sortSegment.length > 1 && Math.random() < amount) {
                            // Sort the segment by the selected criteria
                            sortSegment.sort((a, b) => getSortValue(a) - getSortValue(b));
                            
                            // Apply the sorted segment back to the column
                            let idx = y - sortSegment.length;
                            if (y === height - 1 && pixelValue > effectiveThreshold) {
                                idx++;
                            }
                            
                            for (let j = 0; j < sortSegment.length; j++) {
                                column[idx + j] = sortSegment[j];
                            }
                        }
                        
                        sortingPixels = false;
                        sortSegment = [];
                    } else if (sortingPixels) {
                        // Add to current segment
                        sortSegment.push(pixel);
                    }
                }
                
                // Write the column back to the pixels array
                for (let y = 0; y < height; y++) {
                    const idx = y * width + x;
                    pixels[idx] = column[y];
                }
            }
        }
        
        // Write the sorted pixels back to the imageData
        for (let i = 0; i < pixels.length; i++) {
            const idx = i * 4;
            const pixel = pixels[i];
            imageData.data[idx] = pixel.r;
            imageData.data[idx + 1] = pixel.g;
            imageData.data[idx + 2] = pixel.b;
            imageData.data[idx + 3] = pixel.a;
        }
    }

    // Handle dither toggle change
    function handleDitherToggleChange() {
        // If dithering is disabled and we're in SVG preview mode, switch to PNG mode
        if (!ditherToggle.checked && currentPreviewMode === 'svg') {
            togglePreviewMode('png');
        }
        
        // Update SVG export button and preview state
        updateSvgAvailability();
        
        // Process the image with the new setting
        processImage();
    }
    
    // Update SVG availability based on dithering state
    function updateSvgAvailability() {
        const isDitheringEnabled = ditherToggle.checked;
        
        // Get SVG export button and SVG toggle button
        const svgExportBtn = document.getElementById('exportSvg');
        
        if (isDitheringEnabled) {
            // Enable SVG export and preview
            svgExportBtn.classList.remove('disabled');
            svgToggle.classList.remove('disabled');
            svgToggle.disabled = false;
        } else {
            // Disable SVG export and preview
            svgExportBtn.classList.add('disabled');
            svgToggle.classList.add('disabled');
            svgToggle.disabled = true;
        }
    }

    // JPEG artifact control functions
    function toggleJpegGlitchControls() {
        if (jpegGlitchToggle.checked) {
            jpegGlitchControls.style.display = 'block';
        } else {
            jpegGlitchControls.style.display = 'none';
        }
        processImage();
    }
    
    function updateJpegBlockSizeValue() {
        jpegBlockSizeValue.value = jpegBlockSize.value;
        processImage();
    }
    
    function updateJpegQuantizationValue() {
        jpegQuantizationValue.value = jpegQuantization.value;
        processImage();
    }
    
    function updateJpegFreqNoiseValue() {
        jpegFreqNoiseValue.value = jpegFreqNoise.value;
        processImage();
    }
    
    // DCT implementation for JPEG artifacts
    function applyJpegArtifacts(imageData, blockSize, quantization, noiseAmount, mode, width, height) {
        // Prepare channels
        const channels = [
            new Float32Array(width * height), // R
            new Float32Array(width * height), // G
            new Float32Array(width * height)  // B
        ];
        
        // Split channels
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4;
            channels[0][i] = imageData.data[idx];     // R
            channels[1][i] = imageData.data[idx + 1]; // G
            channels[2][i] = imageData.data[idx + 2]; // B
        }
        
        // Process each channel
        channels.forEach((channel, cIdx) => {
            // Process blocks
            for (let blockY = 0; blockY < height; blockY += blockSize) {
                for (let blockX = 0; blockX < width; blockX += blockSize) {
                    // Extract block
                    const block = extractBlock(channel, blockX, blockY, blockSize, width, height);
                    
                    // Apply DCT
                    const dctBlock = applyDCT(block, blockSize);
                    
                    // Apply quantization and noise
                    const processedBlock = processFrequencies(dctBlock, quantization, noiseAmount, mode, blockSize, cIdx);
                    
                    // Apply inverse DCT
                    const idctBlock = applyIDCT(processedBlock, blockSize);
                    
                    // Place block back
                    placeBlock(channel, idctBlock, blockX, blockY, blockSize, width, height);
                }
            }
        });
        
        // Combine channels back
        for (let i = 0; i < width * height; i++) {
            const idx = i * 4;
            imageData.data[idx] = clamp(channels[0][i], 0, 255);     // R
            imageData.data[idx + 1] = clamp(channels[1][i], 0, 255); // G
            imageData.data[idx + 2] = clamp(channels[2][i], 0, 255); // B
        }
        
        // Apply block boundary enhancement for blockGlitch mode
        if (mode === 'blockGlitch') {
            enhanceBlockBoundaries(imageData, blockSize, width, height);
        }
    }

    function extractBlock(channel, startX, startY, blockSize, width, height) {
        const block = new Float32Array(blockSize * blockSize);
        for (let y = 0; y < blockSize; y++) {
            for (let x = 0; x < blockSize; x++) {
                if (startX + x < width && startY + y < height) {
                    block[y * blockSize + x] = channel[(startY + y) * width + (startX + x)];
                }
            }
        }
        return block;
    }

    function placeBlock(channel, block, startX, startY, blockSize, width, height) {
        for (let y = 0; y < blockSize; y++) {
            for (let x = 0; x < blockSize; x++) {
                if (startX + x < width && startY + y < height) {
                    channel[(startY + y) * width + (startX + x)] = block[y * blockSize + x];
                }
            }
        }
    }

    function applyDCT(block, blockSize) {
        const dctBlock = new Float32Array(blockSize * blockSize);
        
        for (let v = 0; v < blockSize; v++) {
            for (let u = 0; u < blockSize; u++) {
                let sum = 0;
                
                for (let y = 0; y < blockSize; y++) {
                    for (let x = 0; x < blockSize; x++) {
                        const cos1 = Math.cos(((2 * x + 1) * u * Math.PI) / (2 * blockSize));
                        const cos2 = Math.cos(((2 * y + 1) * v * Math.PI) / (2 * blockSize));
                        sum += block[y * blockSize + x] * cos1 * cos2;
                    }
                }
                
                const au = u === 0 ? 1 / Math.sqrt(blockSize) : Math.sqrt(2 / blockSize);
                const av = v === 0 ? 1 / Math.sqrt(blockSize) : Math.sqrt(2 / blockSize);
                
                dctBlock[v * blockSize + u] = au * av * sum;
            }
        }
        
        return dctBlock;
    }

    function applyIDCT(dctBlock, blockSize) {
        const block = new Float32Array(blockSize * blockSize);
        
        for (let y = 0; y < blockSize; y++) {
            for (let x = 0; x < blockSize; x++) {
                let sum = 0;
                
                for (let v = 0; v < blockSize; v++) {
                    for (let u = 0; u < blockSize; u++) {
                        const au = u === 0 ? 1 / Math.sqrt(blockSize) : Math.sqrt(2 / blockSize);
                        const av = v === 0 ? 1 / Math.sqrt(blockSize) : Math.sqrt(2 / blockSize);
                        
                        const cos1 = Math.cos(((2 * x + 1) * u * Math.PI) / (2 * blockSize));
                        const cos2 = Math.cos(((2 * y + 1) * v * Math.PI) / (2 * blockSize));
                        
                        sum += au * av * dctBlock[v * blockSize + u] * cos1 * cos2;
                    }
                }
                
                block[y * blockSize + x] = sum;
            }
        }
        
        return block;
    }

    function processFrequencies(dctBlock, quantizationFactor, noiseAmount, mode, blockSize, channelIndex) {
        const processedBlock = new Float32Array(dctBlock);
        const qScale = (101 - quantizationFactor) / 5; // Transform 1-100 slider to appropriate scale
        
        // JPEG quantization matrix (simplified)
        const qMatrix = generateQuantizationMatrix(blockSize, qScale);
        
        for (let v = 0; v < blockSize; v++) {
            for (let u = 0; u < blockSize; u++) {
                const idx = v * blockSize + u;
                
                // Standard quantization and dequantization
                processedBlock[idx] = Math.round(processedBlock[idx] / qMatrix[idx]) * qMatrix[idx];
                
                // Apply frequency noise
                if (noiseAmount > 0) {
                    // Higher frequency = more noise
                    const freqMagnitude = Math.sqrt(u * u + v * v) / Math.sqrt(2 * blockSize * blockSize);
                    const noiseScale = (noiseAmount / 100) * freqMagnitude * 30;
                    let noise = (Math.random() * 2 - 1) * noiseScale;
                    
                    // Different modes
                    if (mode === 'colorShift' && channelIndex > 0) {
                        // Apply more noise to color channels
                        noise *= (1 + channelIndex);
                    } else if (mode === 'extreme') {
                        // More extreme artifacts
                        if (Math.random() < 0.2) {
                            // Occasionally zero out coefficients
                            processedBlock[idx] = 0;
                        } else if (Math.random() < 0.1) {
                            // Occasionally amplify coefficients
                            processedBlock[idx] *= 5;
                        }
                    }
                    
                    processedBlock[idx] += noise;
                }
            }
        }
        
        return processedBlock;
    }

    function generateQuantizationMatrix(size, qScale) {
        const matrix = new Float32Array(size * size);
        
        // Standard JPEG luminance quantization basis
        const baseMatrix8x8 = [
            16, 11, 10, 16, 24, 40, 51, 61,
            12, 12, 14, 19, 26, 58, 60, 55,
            14, 13, 16, 24, 40, 57, 69, 56,
            14, 17, 22, 29, 51, 87, 80, 62,
            18, 22, 37, 56, 68, 109, 103, 77,
            24, 35, 55, 64, 81, 104, 113, 92,
            49, 64, 78, 87, 103, 121, 120, 101,
            72, 92, 95, 98, 112, 100, 103, 99
        ];
        
        for (let i = 0; i < size * size; i++) {
            const y = Math.floor(i / size);
            const x = i % size;
            
            // Scale to block size, repeating if needed
            const baseY = y % 8;
            const baseX = x % 8;
            const baseValue = baseMatrix8x8[baseY * 8 + baseX];
            
            // Apply quantization scale
            matrix[i] = Math.max(1, Math.round(baseValue * qScale));
        }
        
        return matrix;
    }

    function enhanceBlockBoundaries(imageData, blockSize, width, height) {
        // Create a temporary copy
        const tempData = new Uint8ClampedArray(imageData.data);
        
        // Enhance block edges
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Check if we're at a block boundary
                const isBlockBoundary = x % blockSize === 0 || y % blockSize === 0;
                
                if (isBlockBoundary && x > 0 && y > 0 && x < width - 1 && y < height - 1) {
                    const idx = (y * width + x) * 4;
                    
                    // Add a subtle edge effect
                    if (Math.random() < 0.7) {
                        // Darken this pixel
                        for (let c = 0; c < 3; c++) {
                            tempData[idx + c] = Math.max(0, tempData[idx + c] - 20);
                        }
                    }
                }
            }
        }
        
        // Copy back
        for (let i = 0; i < tempData.length; i++) {
            imageData.data[i] = tempData[i];
        }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Toggle the drop zone background between pattern and solid color
    function toggleDropZoneBackground() {
        isDefaultBackground = !isDefaultBackground;
        
        if (isDefaultBackground) {
            // Restore the default background pattern
            const pattern = `
                linear-gradient(45deg, #2a2a2a 25%, transparent 25%), 
                linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #2a2a2a 75%), 
                linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)
            `;
            
            // Apply to drop zone
            dropZone.style.backgroundImage = pattern;
            dropZone.style.backgroundSize = '20px 20px';
            dropZone.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
            dropZone.style.backgroundColor = ''; // Reset to default CSS value
            
            // Apply to SVG preview
            svgPreview.style.backgroundImage = pattern;
            svgPreview.style.backgroundSize = '20px 20px';
            svgPreview.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
            svgPreview.style.backgroundColor = ''; // Reset to default CSS value
            
            showNotification('Default background pattern restored');
        } else {
            // Apply the current color value
            updateDropZoneBackground(dropZoneBgColor.value);
        }
    }

    // Update the drop zone background with a solid color
    function updateDropZoneBackground(color) {
        // Apply to drop zone
        dropZone.style.backgroundImage = 'none';
        dropZone.style.backgroundColor = color;
        
        // Apply to SVG preview
        svgPreview.style.backgroundImage = 'none';
        svgPreview.style.backgroundColor = color;
        
        showNotification('Background color updated');
    }

    // Clear all frames
    clearFramesBtn.addEventListener('click', function() {
        if (!snapshotContainer) return;
        if (frames.length === 0) return;
        
        // Clear all thumbnails
        frames = [];
        while (snapshotContainer.firstChild) {
            snapshotContainer.removeChild(snapshotContainer.firstChild);
        }
        
        // Add empty state message back
        updateSnapshotGallery();
        
        // Show notification
        showNotification('All frames cleared');
    });
    
    // Reverse frames order
    reverseFramesBtn.addEventListener('click', function() {
        if (!snapshotContainer || frames.length <= 1) {
            if (frames.length <= 1) {
                showNotification('Need at least 2 frames to reverse order', true);
            }
            return;
        }
        
        // Reverse frames array
        frames.reverse();
        
        // Rebuild thumbnails in new order
        while (snapshotContainer.firstChild) {
            snapshotContainer.removeChild(snapshotContainer.firstChild);
        }
        
        // Add thumbnails in reversed order
        frames.forEach((frame, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'snapshot-thumbnail';
            thumbnail.dataset.index = index;
            
            // Add the snapshot image
            const img = document.createElement('img');
            img.src = frame.src;
            thumbnail.appendChild(img);
            
            // Add frame number
            const frameNumber = document.createElement('div');
            frameNumber.className = 'frame-number';
            frameNumber.textContent = index + 1;
            thumbnail.appendChild(frameNumber);
            
            // Add delete button
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'delete-frame';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                thumbnail.remove();
                frames.splice(parseInt(thumbnail.dataset.index), 1);
                updateFrameNumbers();
                updateSnapshotGallery();
            });
            thumbnail.appendChild(deleteBtn);
            
            // Add to the container and frames array
            snapshotContainer.appendChild(thumbnail);
        });
        
        // Update frame numbers
        updateFrameNumbers();
        
        // Show notification
        showNotification('Frames order reversed');
    });
    
    // Reset frames to default order (sorting by frame number)
    sortFramesBtn.addEventListener('click', function() {
        if (!snapshotContainer || frames.length <= 1) {
            if (frames.length <= 1) {
                showNotification('Need at least 2 frames to sort', true);
            }
            return;
        }
        
        // Create a new array of frames sorted by their original index
        const sortedFrames = frames.slice().sort((a, b) => {
            // Compare the indices they had when they were first added
            // We're assuming each frame has an original index
            return a.originalIndex - b.originalIndex;
        });
        
        // If frames don't have originalIndex, we'll recreate the gallery in numeric order
        if (isNaN(sortedFrames[0]?.originalIndex)) {
            // Sort by the numeric part of the frame number text
            const thumbnails = Array.from(snapshotContainer.querySelectorAll('.snapshot-thumbnail'));
            thumbnails.sort((a, b) => {
                const aNum = parseInt(a.querySelector('.frame-number').textContent);
                const bNum = parseInt(b.querySelector('.frame-number').textContent);
                return aNum - bNum;
            });
            
            // Clear container
            while (snapshotContainer.firstChild) {
                snapshotContainer.removeChild(snapshotContainer.firstChild);
            }
            
            // Re-add thumbnails in order and rebuild frames array
            frames = [];
            
            thumbnails.forEach((thumbnail, index) => {
                // Update data-index
                thumbnail.dataset.index = index;
                
                // Update the frame number
                const frameNumber = thumbnail.querySelector('.frame-number');
                if (frameNumber) {
                    frameNumber.textContent = (index + 1).toString();
                }
                
                // Get image source to add to frames array
                const img = thumbnail.querySelector('img');
                if (img) {
                    frames.push({
                        src: img.src,
                        canvas: img.src,
                        originalIndex: index  // Set originalIndex for future sorts
                    });
                }
                
                // Add thumbnail back to the container
                snapshotContainer.appendChild(thumbnail);
            });
        } else {
            // Use the sorted frames array
            frames = sortedFrames;
            
            // Rebuild the thumbnails in the container
            while (snapshotContainer.firstChild) {
                snapshotContainer.removeChild(snapshotContainer.firstChild);
            }
            
            // Create new thumbnails
            frames.forEach((frame, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'snapshot-thumbnail';
                thumbnail.dataset.index = index;
                
                // Add the frame image
                const img = document.createElement('img');
                img.src = frame.src;
                thumbnail.appendChild(img);
                
                // Add frame number
                const frameNumber = document.createElement('div');
                frameNumber.className = 'frame-number';
                frameNumber.textContent = index + 1;
                thumbnail.appendChild(frameNumber);
                
                // Add delete button
                const deleteBtn = document.createElement('div');
                deleteBtn.className = 'delete-frame';
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    thumbnail.remove();
                    frames.splice(parseInt(thumbnail.dataset.index), 1);
                    updateFrameNumbers();
                    updateSnapshotGallery();
                });
                thumbnail.appendChild(deleteBtn);
                
                // Add to container
                snapshotContainer.appendChild(thumbnail);
            });
        }
        
        // Show notification
        showNotification('Frames sorted in default order');
    });

    // Export as GIF
    const exportGIFBtn = document.getElementById('exportGIF');
    exportGIFBtn.addEventListener('click', async function() {
        if (frames.length === 0) {
            showNotification('No frames to export', true);
            return;
        }
        
        // Show loading overlay
        loadingOverlay.classList.add('active');
        showNotification('Creating GIF, please wait...', false);
        
        try {
            // Get fps from input
            const fps = parseInt(frameSpeedInput.value) || 10; // Default to 10 fps if invalid
            
            // Calculate delay in 1/100th seconds (GIF timing unit)
            // For very low fps values, we need precise control to ensure correct timing
            // GIF specification uses 1/100 second units for frame delay
            const frameDelay = Math.max(2, Math.round(100 / fps)); // Minimum of 2 (some browsers ignore smaller values)
            
            // For extremely low FPS values (less than 1), 
            // we may need multiple copies of the same frame or a higher delay value
            // Maximum GIF delay is typically 655.35 seconds (65535 in 1/100th of a second)
            const duplicateFrames = fps < 1 ? Math.ceil(1 / fps) : 1;
            
            // Log the frame delay for debugging
            console.log(`FPS: ${fps}, Frame delay: ${frameDelay} (${frameDelay/100} seconds), Duplicate frames: ${duplicateFrames}`);
            
            // Get loop count from input
            const loopCount = parseInt(document.getElementById('loopCount').value) || 1;
            
            // Load the first frame to get dimensions
            const firstImg = new Image();
            firstImg.src = frames[0].src;
            
            // Wait for the image to load
            await new Promise(resolve => {
                firstImg.onload = resolve;
            });
            
            // Log dimensions to verify
            console.log(`Original image dimensions: ${firstImg.width}x${firstImg.height}`);
            
            // Create temporary canvas to ensure all frames have the same dimensions
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = firstImg.width;
            tempCanvas.height = firstImg.height;
            const tempCtx = tempCanvas.getContext('2d', { alpha: true }); // Explizit Alpha-Kanal aktivieren
            
            // Create GIF encoder with optimal settings
            const gif = new GIF({
                workers: 4,                    // Use 4 web workers for better performance
                quality: 5,                    // Higher quality (lower number = better quality but slower)
                width: firstImg.width,         // Match the original image dimensions (no resizing)
                height: firstImg.height,
                workerScript: 'data/gif.worker.js', // Use local worker file in data folder
                repeat: loopCount > 1 ? loopCount - 1 : 0, // 0 = loop forever, -1 = no repeat, n = repeat n times
                dither: false,                 // Disable dithering to preserve original colors
                transparent: 0x00000000        // True black transparent color
            });
            
            // Process all frames with the repeat based on loop count
            let totalFramesToProcess = frames.length;
            // If loop count is specified
            if (loopCount > 1) {
                totalFramesToProcess = frames.length * loopCount;
            }
            
            // Adjust total frames if duplicating frames for very low FPS
            if (duplicateFrames > 1) {
                totalFramesToProcess *= duplicateFrames;
            }
            
            // Track processing progress
            let processedFrames = 0;
            
            // Load all images first to ensure they're properly loaded
            const images = [];
            for (let i = 0; i < frames.length; i++) {
                const img = new Image();
                await new Promise(resolve => {
                    img.onload = resolve;
                    img.src = frames[i].src;
                });
                images.push(img);
                
                // Update loading progress (0-50%)
                const loadProgress = Math.round((i + 1) / frames.length * 50);
                showNotification(`Loading frames: ${loadProgress}%`, false);
            }
            
            // Process all frames
            for (let loop = 0; loop < loopCount; loop++) {
                for (let i = 0; i < frames.length; i++) {
                    // Get the preloaded image
                    const img = images[i];
                    
                    // Draw on temp canvas to ensure consistent dimensions
                    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                    
                    // Preserve original pixel values including transparency
                    tempCtx.globalCompositeOperation = 'source-over';
                    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
                    
                    // For very low FPS, duplicate frames as needed to achieve the correct timing
                    for (let d = 0; d < duplicateFrames; d++) {
                        // Add frame to the GIF with correct delay
                        gif.addFrame(tempCanvas, {
                            delay: frameDelay, // Frame delay in 1/100th seconds based on FPS
                            copy: true,        // Copy the canvas pixels, not just a reference
                            transparent: true   // Enable transparency detection for this frame
                        });
                        
                        // Only increment counter once for first frame to avoid affecting progress calculation
                        if (d === 0) {
                            // Update progress (50-100%)
                            processedFrames++;
                            const progress = 50 + Math.round((processedFrames / totalFramesToProcess) * 50);
                            showNotification(`Processing GIF: ${progress}%`, false);
                        }
                    }
                }
            }
            
            // Once all frames are processed, render the GIF
            gif.on('progress', function(p) {
                showNotification(`Encoding GIF: ${Math.round(p * 100)}%`, false);
            });
            
            gif.on('finished', function(blob) {
                // Hide loading overlay
                loadingOverlay.classList.remove('active');
                
                // Create download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dither_animation_${new Date().getTime()}.gif`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Clean up
                URL.revokeObjectURL(url);
                
                showNotification('GIF export completed!', false);
            });
            
            // Render the GIF (starts the encoding process)
            gif.render();
            
        } catch (error) {
            // Handle errors
            console.error('GIF export error:', error);
            loadingOverlay.classList.remove('active');
            showNotification('GIF export failed: ' + error.message, true);
        }
    });

    // Circuit Grid Dithering (previously called H Modulation)
    function circuitGridDither(imageData, threshold, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const result = new Uint8ClampedArray(width * height);
        
        // Get the pattern size and angle from sliders
        const patternSizeValue = parseFloat(patternSize?.value || 10);
        const angleInRadians = (parseInt(patternAngle?.value || 0) * Math.PI / 180);
        
        // Calculate the center of the image for rotation
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Get the current pixel's grayscale value
                const idx = (y * width + x) * 4;
                const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
                
                // Calculate coordinates relative to center for rotation
                const dx = x - centerX;
                const dy = y - centerY;
                
                // Rotate according to angle slider
                const rotatedX = dx * Math.cos(angleInRadians) - dy * Math.sin(angleInRadians) + centerX;
                const rotatedY = dx * Math.sin(angleInRadians) + dy * Math.cos(angleInRadians) + centerY;
                
                // Calculate the circuit grid pattern positions
                const gridX = Math.floor(rotatedX / patternSizeValue);
                const gridY = Math.floor(rotatedY / patternSizeValue);
                
                // Determine position within the grid cell
                const cellX = rotatedX % patternSizeValue;
                const cellY = rotatedY % patternSizeValue;
                
                // Calculate the gray value modulation factor (0-1)
                const modulation = Math.max(0, Math.min(1, (255 - gray) / 255 * strength));
                
                // Create different components of the circuit pattern
                
                // Horizontal and vertical "wires"
                const isHorizontalWire = Math.abs(cellY - patternSizeValue/2) < patternSizeValue/8;
                const isVerticalWire = Math.abs(cellX - patternSizeValue/2) < patternSizeValue/8;
                
                // "Nodes" at intersections and some corners
                const isNode = 
                    // Center intersection
                    (Math.abs(cellX - patternSizeValue/2) < patternSizeValue/6 && 
                     Math.abs(cellY - patternSizeValue/2) < patternSizeValue/6) ||
                    // Some corner nodes (vary by grid position to create variety)
                    ((gridX + gridY) % 3 === 0 && 
                     cellX < patternSizeValue/4 && cellY < patternSizeValue/4) ||
                    ((gridX - gridY) % 4 === 0 && 
                     cellX > patternSizeValue*3/4 && cellY < patternSizeValue/4) ||
                    ((gridX * gridY) % 5 === 0 && 
                     cellX < patternSizeValue/4 && cellY > patternSizeValue*3/4);
                
                // Occasional "components" connecting to wires
                const isComponent = 
                    // Add some variety based on grid position
                    ((gridX + gridY) % 7 === 2 && 
                     cellX > patternSizeValue*3/4 && 
                     Math.abs(cellY - patternSizeValue/2) < patternSizeValue/4) ||
                    ((gridX - gridY) % 5 === 1 && 
                     cellY > patternSizeValue*3/4 && 
                     Math.abs(cellX - patternSizeValue/2) < patternSizeValue/4);
                
                // Determine if this pixel is part of the circuit pattern
                const isPattern = isHorizontalWire || isVerticalWire || isNode || isComponent;
                
                // The pattern thickness increases with the modulation factor
                const patternThreshold = isPattern ? 
                    threshold * (1 - modulation * 0.8) : // Thinner in light areas
                    threshold * 1.2; // Higher threshold for non-pattern areas (more white)
                
                // Apply threshold based on the pattern
                result[y * width + x] = gray < patternThreshold ? 0 : 255;
            }
        }
        
        return result;
    }

    function showInfoModal() {
        // Make sure modal is positioned properly in fullscreen
        if (document.fullscreenElement || 
            document.webkitFullscreenElement || 
            document.mozFullScreenElement ||
            document.msFullscreenElement) {
            ditherInfoModal.style.position = 'fixed';
            ditherInfoModal.style.zIndex = '999999';
        }
        
        // First display the modal
        ditherInfoModal.style.display = 'flex';
        
        // Get the modal content
        const modalContent = ditherInfoModal.querySelector('.modal-content');
        
        // Add background fade-in animation
        ditherInfoModal.classList.remove('modal-bg-fade-out');
        ditherInfoModal.classList.add('modal-bg-fade-in');
        
        // Remove any existing animation classes
        modalContent.classList.remove('modal-animate-out');
        
        // Add the slide-in animation class
        modalContent.classList.add('modal-animate-in');
    }

    function closeInfoModal() {
        // Get the modal content
        const modalContent = ditherInfoModal.querySelector('.modal-content');
        
        // Add background fade-out animation
        ditherInfoModal.classList.remove('modal-bg-fade-in');
        ditherInfoModal.classList.add('modal-bg-fade-out');
        
        // Remove the slide-in class
        modalContent.classList.remove('modal-animate-in');
        
        // Add the slide-out animation class
        modalContent.classList.add('modal-animate-out');
        
        // Wait for the animation to complete before hiding the modal
        setTimeout(function() {
            ditherInfoModal.style.display = 'none';
            // Clean up the animation classes after hiding
            modalContent.classList.remove('modal-animate-out');
            ditherInfoModal.classList.remove('modal-bg-fade-out');
        }, 300); // Match the animation duration in CSS (0.3s)
    }

}); // End of DOMContentLoaded

// Fullscreen functionality
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const container = document.querySelector('.container');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement &&    // Standard property
            !document.mozFullScreenElement && // Firefox
            !document.webkitFullscreenElement && // Chrome, Safari, Opera
            !document.msFullscreenElement) {  // IE/Edge
            
            // Enter fullscreen
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) { // Firefox
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) { // Chrome, Safari, Opera
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) { // IE/Edge
                container.msRequestFullscreen();
            }
            
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            fullscreenBtn.title = "Exit Fullscreen";
            
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
            
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.title = "Toggle Fullscreen";
        }
    }
    
    // Update button icon when exiting fullscreen via ESC key
    document.addEventListener('fullscreenchange', updateFullscreenButtonIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButtonIcon);
    document.addEventListener('mozfullscreenchange', updateFullscreenButtonIcon);
    document.addEventListener('MSFullscreenChange', updateFullscreenButtonIcon);
    
    function updateFullscreenButtonIcon() {
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement &&
            !document.msFullscreenElement) {
            
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.title = "Toggle Fullscreen";
        }
    }
});
