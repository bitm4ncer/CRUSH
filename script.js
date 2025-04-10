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
    const threshold = document.getElementById('threshold');
    const thresholdValue = document.getElementById('thresholdValue');
    const ditherAmount = document.getElementById('ditherAmount');
    const ditherAmountValue = document.getElementById('ditherAmountValue');
    const brightness = document.getElementById('brightness');
    const brightnessValue = document.getElementById('brightnessValue');
    const contrast = document.getElementById('contrast');
    const contrastValue = document.getElementById('contrastValue');
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
    contrastValue.textContent = contrast.value;
    brightnessValue.textContent = brightness.value;
    thresholdValue.textContent = threshold.value;
    blurValue.textContent = blur.value;
    ditherAmountValue.textContent = ditherAmount.value;
    blockSizeValue.textContent = blockSize.value + "%";
    blackPointValue.textContent = blackPoint.value;
    midPointValue.textContent = midPoint.value;
    whitePointValue.textContent = whitePoint.value;
    
    // Initialize UI state and event handlers
    updateColorPickerVisibility();
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

    // Set up the event listeners for controls
    algorithm.addEventListener('change', processImage);
    contrast.addEventListener('input', updateContrastValue);
    brightness.addEventListener('input', updateBrightnessValue);
    threshold.addEventListener('input', updateThresholdValue);
    blur.addEventListener('input', updateBlurValue);
    ditherAmount.addEventListener('input', updateDitherAmountValue);
    blockSize.addEventListener('input', updateBlockSizeValue);
    colorMode.addEventListener('change', handleColorModeChange);
    fgColor.addEventListener('change', processImage);
    bgColor.addEventListener('change', processImage);
    blackPoint.addEventListener('input', updateBlackPointValue);
    midPoint.addEventListener('input', updateMidPointValue);
    whitePoint.addEventListener('input', updateWhitePointValue);
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
        if (colorMode.value === 'custom') {
            customColorPickers.classList.add('active');
        } else {
            customColorPickers.classList.remove('active');
        }
        
        if (colorMode.value === 'multicolor') {
            multiColorPickers.classList.add('active');
        } else {
            multiColorPickers.classList.remove('active');
        }
    }

    function togglePreviewMode(mode) {
        if (currentPreviewMode === mode) return;
        
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
                // Calculate dimensions to maintain aspect ratio
                const maxDimension = 1000;
                let width = originalImage.width;
                let height = originalImage.height;

                if (width > height && width > maxDimension) {
                    height = Math.floor(height * (maxDimension / width));
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = Math.floor(width * (maxDimension / height));
                    height = maxDimension;
                }
                
                // Set fixed display dimensions
                const displayWidth = width;
                const displayHeight = height;
                
                // Apply resolution scaling based on slider value
                const resolutionScale = parseInt(blockSize.value) / 100;
                const processingWidth = Math.max(4, Math.floor(width * resolutionScale));
                const processingHeight = Math.max(4, Math.floor(height * resolutionScale));
                
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

                // Apply dithering based on selected algorithm
                const colorModeValue = colorMode.value;
                const thresholdValue = parseInt(threshold.value);
                const ditherStrength = parseInt(ditherAmount.value) / 100;

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
                            processedImageData.data[idx + 3] = 255; // Alpha
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
        
        // Original dimensions for SVG viewBox
        const width = outputCanvas.width;
        const height = outputCanvas.height;
        
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
        svg += `  <rect width="${width}" height="${height}" fill="${backgroundColor}"/>\n`;
        
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
        const blurRadius = parseFloat(blur.value);
        
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

    function drawScaledCustomColorResult(result, width, height, pixelSize) {
        outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        // Get the custom foreground and background colors
        const foregroundColor = fgColor.value;
        const backgroundColor = bgColor.value;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const value = result[y * width + x];
                outputCtx.fillStyle = value === 0 ? foregroundColor : backgroundColor;
                outputCtx.fillRect(
                    x * pixelSize, 
                    y * pixelSize, 
                    pixelSize, 
                    pixelSize
                );
            }
        }
    }

    function updateContrastValue() {
        contrastValue.textContent = contrast.value;
        processImageWithDelay();
    }

    function updateBrightnessValue() {
        brightnessValue.textContent = brightness.value;
        processImageWithDelay();
    }

    function updateThresholdValue() {
        thresholdValue.textContent = threshold.value;
        processImageWithDelay();
    }

    function updateBlurValue() {
        blurValue.textContent = blur.value;
        processImageWithDelay();
    }

    function updateDitherAmountValue() {
        ditherAmountValue.textContent = ditherAmount.value;
        processImageWithDelay();
    }

    function updateBlockSizeValue() {
        blockSizeValue.textContent = blockSize.value + "%";
        processImageWithDelay();
    }

    function updateBlackPointValue() {
        blackPointValue.textContent = blackPoint.value;
        // Ensure blackPoint <= midPoint <= whitePoint
        if (parseInt(blackPoint.value) >= parseInt(midPoint.value)) {
            midPoint.value = parseInt(blackPoint.value) + 1;
            midPointValue.textContent = midPoint.value;
        }
        processImageWithDelay();
    }
    
    function updateMidPointValue() {
        midPointValue.textContent = midPoint.value;
        // Ensure blackPoint <= midPoint <= whitePoint
        if (parseInt(midPoint.value) <= parseInt(blackPoint.value)) {
            blackPoint.value = parseInt(midPoint.value) - 1;
            blackPointValue.textContent = blackPoint.value;
        }
        if (parseInt(midPoint.value) >= parseInt(whitePoint.value)) {
            whitePoint.value = parseInt(midPoint.value) + 1;
            whitePointValue.textContent = whitePoint.value;
        }
        processImageWithDelay();
    }
    
    function updateWhitePointValue() {
        whitePointValue.textContent = whitePoint.value;
        // Ensure blackPoint <= midPoint <= whitePoint
        if (parseInt(whitePoint.value) <= parseInt(midPoint.value)) {
            midPoint.value = parseInt(whitePoint.value) - 1;
            midPointValue.textContent = midPoint.value;
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
        contrast.value = 0;
        contrastValue.textContent = 0;
        brightness.value = 0;
        brightnessValue.textContent = 0;
        threshold.value = 128;
        thresholdValue.textContent = 128;
        blur.value = 0;
        blurValue.textContent = 0;
        ditherAmount.value = 100;
        ditherAmountValue.textContent = 100;
        blockSize.value = 100;
        blockSizeValue.textContent = "100%";
        algorithm.value = 'floydSteinberg';
        colorMode.value = 'bw';
        fgColor.value = '#000000';
        bgColor.value = '#FFFFFF';
        
        // Reset levels
        blackPoint.value = 0;
        blackPointValue.textContent = 0;
        midPoint.value = 128;
        midPointValue.textContent = 128;
        whitePoint.value = 255;
        whitePointValue.textContent = 255;
        
        // Reset inversion
        isInverted = false;
        document.getElementById('invertBtn').classList.remove('active');
        
        updateColorPickerVisibility();
        
        // Sync the algorithm button group with the select value
        syncButtonGroupWithSelect();
        syncColorModeButtonsWithSelect();
        
        if (originalImage) {
            processImage();
        }
        
        // Show notification
        showNotification('All settings have been reset');
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
        if (!originalImage) {
            showNotification('No image to export', true);
            return;
        }

        const width = outputCanvas.width;
        const height = outputCanvas.height;
        
        try {
            loadingOverlay.classList.add('active');
            
            setTimeout(() => {
                const selectedColorMode = colorMode.value;
                let svgContent = '';
                
                if (selectedColorMode === 'bw' || selectedColorMode === 'custom') {
                    svgContent = generateBWSvg();
                } else if (selectedColorMode === 'rgb' || selectedColorMode === 'cmyk') {
                    svgContent = generateColorSvg();
                }
                
                // Store the SVG content for preview
                currentSvgContent = svgContent;
                
                // Create a downloadable link
                const blob = new Blob([svgContent], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'dithered-image.svg';
                link.href = url;
                link.click();
                
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
                outputCtx.fillStyle = value === 0 ? 'black' : 'white';
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
        if (!bitToneControls || !mosaicControls || !patternControls || !waveControls || !sineWaveControls) return;
        
        // Hide all controls first
        const allControls = document.querySelectorAll('.algorithm-specific-controls');
        allControls.forEach(control => control.classList.remove('active'));
        
        // Show relevant controls based on selected algorithm
        const selectedAlgorithm = algorithm.value;
        
        if (selectedAlgorithm === 'bitTone') {
            bitToneControls.classList.add('active');
        } else if (selectedAlgorithm === 'mosaic') {
            mosaicControls.classList.add('active');
        } else if (['radialBurst', 'vortex', 'diamond', 'gridlock', 'halftone'].includes(selectedAlgorithm)) {
            patternControls.classList.add('active');
        } else if (selectedAlgorithm === 'wave') {
            waveControls.classList.add('active');
        } else if (selectedAlgorithm === 'sineWave') {
            sineWaveControls.classList.add('active');
        } else if (selectedAlgorithm === 'checkerSmall') {
            // Add pattern size control for checkerboard pattern
            patternControls.classList.add('active');
        }
        
        // Process the image with the new algorithm
        if (originalImage) {
            processImage();
        }
    }
    
    // Update getDitherFunction to include new algorithms
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
            default: return floydSteinbergDither;
        }
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
    const closeInfoModal = document.getElementById('closeInfoModal');

    // Show the info modal when the info button is clicked
    infoBtn.addEventListener('click', function(event) {
        // Prevent event propagation to avoid collapsing the panel
        event.stopPropagation();
        
        // Display the modal
        ditherInfoModal.style.display = 'flex';
    });

    // Hide the info modal when the close button is clicked
    closeInfoModal.addEventListener('click', function() {
        ditherInfoModal.style.display = 'none';
    });

    // Also close the modal when clicking outside the content
    ditherInfoModal.addEventListener('click', function(event) {
        if (event.target === ditherInfoModal) {
            ditherInfoModal.style.display = 'none';
        }
    });
});
