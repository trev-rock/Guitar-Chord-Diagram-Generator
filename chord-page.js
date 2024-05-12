const root = document.documentElement;
const notesList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const fretboard = document.querySelector('.fretboard');
let numberOfFrets = parseInt(document.getElementById("numberOfFrets").value);
let numberOfStrings = parseInt(document.getElementById("numberOfStrings").value);
let startingFret = parseInt(document.getElementById("startingFret").value);
let tuning = document.getElementById("tuningInput").value;
let title = document.getElementById("title").value;
let capoFret = document.getElementById("capoDropDown").value;

let guitarTuning = getTuningIndexes(tuning, notesList); 

const saveImageButton = document.getElementById("saveImage");

const intervals = {
    flatNine: 1,
    twoOrNine: 2,
    flatThreeOrSharpNine: 3,
    three: 4,
    fourOrEleven: 5,
    sharpElevenOrFlatFive: 6,
    five: 7,
    sharpFiveOrFlatThirteen: 8,
    sixOrThirteen: 9,
    flatSeven: 10,
    seven: 11
}

const listOfFrets = [...Array(25).keys()]; // for capo ppulating the list
listOfFrets[0] = "No capo";
listOfFrets.forEach(fret => {
    let option = document.createElement('option');
    option.value = fret;
    option.text = fret;
    capoDropDown.appendChild(option);
});

function getTuningIndexes(tuning, notesList) {
    if (tuning === '') {
        return Array(numberOfStrings).fill('UD');
    }

    const tuningNotes = tuning.match(/([A-G]#?)/g); // Split the tuning string into individual notes
    const tuningIndexes = tuningNotes.map(note => notesList.indexOf(note)); // Get the index of each note from notesList
    return tuningIndexes;
}

const app = {
    init() {
        // we will probably have a set up tuning first
        this.setupEventListeners();
        this.updateTuningOptions(numberOfStrings);
        this.setupFretboard();
    },
    setupFretboard() {
        root.style.setProperty('--number-of-strings', numberOfStrings)
        // add strings to fretboard 
        for (let i = 0; i < numberOfStrings; i++) {
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);
        
            // create all of the frets for the strings
            // j represents the number of the amount of frets we are counting, fret is the actual fret number
            for (let j = 0; j <= numberOfFrets; j++) {
                let noteFret = tools.createElement('div');
                noteFret.classList.add('note-fret');

                if(numberOfStrings == 4){
                    if(i === 0) {
                        noteFret.classList.add("left_transparent_border_0");
                    }
                    if(i === numberOfStrings - 1) {
                        noteFret.classList.add("right_transparent_border_0");
                    }
                }
                if(numberOfStrings == 5){
                    if(i === 0) {
                        noteFret.classList.add("left_transparent_border");
                    }
                    if(i === numberOfStrings - 1) {
                        noteFret.classList.add("right_transparent_border");
                    }
                }
                if(numberOfStrings == 6){
                    if(i === 0) {
                        noteFret.classList.add("left_transparent_border_2");
                    }
                    if(i === numberOfStrings - 1) {
                        noteFret.classList.add("right_transparent_border_2");
                    }
                }
                if(numberOfStrings == 8){
                    if(i === 0) {
                        noteFret.classList.add("left_transparent_border_3");
                    }
                    if(i === numberOfStrings - 1) {
                        noteFret.classList.add("right_transparent_border_3");
                    }
                }
                if(numberOfStrings == 7){
                    if(i === 0) {
                        noteFret.classList.add("left_transparent_border_3");
                    }
                    if(i === numberOfStrings - 1) {
                        noteFret.classList.add("right_transparent_border_3");
                    }
                }
                if(numberOfStrings == 8){
                    if(i === 0) {
                        noteFret.classList.add("left_transparent_border_4");
                    }
                    if(i === numberOfStrings - 1) {
                        noteFret.classList.add("right_transparent_border_4");
                    }
                }
                //End added by Haackstar
                // If it's the first fret, add the .first-note-fret class
                if (j === 0) {
                    noteFret.classList.add('first-note-fret');
                }
                string.appendChild(noteFret);
                let fret = j; 
                // here we shift the frets over for if we are starting on a different fret number, but we keep our open strings as the same values
                if (fret > 0) {
                    fret += (startingFret - 1);
                }
                // assign a note name to the note-fret
                let noteName = this.generateNoteNames(fret + parseInt(guitarTuning[i]));
                noteFret.setAttribute('data-note',noteName);
    
                // Add the starting fret number if needed
                if (i === numberOfStrings - 1 && j === 0 && startingFret !== 1) {
                    let startingFretLabel = tools.createElement('div', startingFret + "fr");
                    startingFretLabel.classList.add('starting-fret-label');
                    noteFret.appendChild(startingFretLabel);
                }

            }
        }
        makeChords();
    },    
    updateTuningOptions(numberOfStrings) {
        const tuningDropdown = document.getElementById('tuningDropdown');
        tuningDropdown.innerHTML = ''; // Clear existing options
    
        // Define some sample tuning options based on the number of strings
        const tuningOptions = {
            4: ['EADG', 'GCEA'],
            5: ['BEADG'],
            6: ['EADGBE', 'FACGCE', 'DAEAC#E', 'EBEG#BE'],
            7: ['BEADGBE'],
            8: ['F#BEADGBE'],
            // Add more options for other number of strings if needed
        };
    
        // Populate the dropdown with appropriate tuning options
        if (tuningOptions[numberOfStrings]) {
            tuningOptions[numberOfStrings].forEach((option) => {
            const newOption = document.createElement('option');
            newOption.value = option;
            newOption.textContent = option;
            tuningDropdown.appendChild(newOption);
            });
    
            // Update the tuning variable and set the value of the tuningInput to the first tuning option
            tuning = tuningOptions[numberOfStrings][0];
            document.getElementById('tuningInput').value = tuning;
            guitarTuning = getTuningIndexes(tuning, notesList);
    
        } else {
            // If there are no tuning options for the selected number of strings, add a placeholder option
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = 'No tuning options available';
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            tuningDropdown.appendChild(placeholderOption);
    
            // Set the tuning variable and the value of the tuningInput to an empty string
            tuning = '';
            document.getElementById('tuningInput').value = tuning;
            guitarTuning = getTuningIndexes(tuning, notesList);
        }
    },
    updateCapoPlacement(capoFret) {
        console.log(guitarTuning);
        if (capoFret == "No capo") { // if there is no capo, go back to the original tuning, have the values be added to whatever the current tuning is
            capoFret = 0;
        } 
        // console.log(capoFret);
        let valueFromTuningInput = document.getElementById("tuningInput").value; // we get this instead of whatever is at tuning because if it changes at all then if we pulled from it we'd be changing something that was already changed so this way it is the original tuning 
        // console.log(valueFromTuningInput);
        let indices = getTuningIndexes(valueFromTuningInput, notesList);
        console.log(indices);
        indices = indices.map(index => (index + parseInt(capoFret)) % notesList.length);
        console.log(indices);
        guitarTuning = indices;
    },
    generateNoteNames(noteIndex) {
        let noteName;
        noteIndex = noteIndex % 12;
        noteName = notesList[noteIndex];
        return noteName;
    },
    updateNumberOfStrings() {
        const NewNumStrings = parseInt(document.getElementById("numberOfStrings").value);
        fretboard.innerHTML = ''; // Remove all current strings from the fretboard
     
        numberOfStrings = NewNumStrings; // Update the global variable numberOfStrings
        if (numberOfStrings <= 4) {
            numberOfStrings = 4;
        } else if (numberOfStrings >= 8) {
            numberOfStrings = 8;
        }   
    },
    updateNumberOfFrets() {
        const NewNumFrets = parseInt(document.getElementById("numberOfFrets").value);
        fretboard.innerHTML = ''; // Remove all current frets from the fretboard
        numberOfFrets = NewNumFrets;
    },
    updateStartingFret() {
        const NewStartingFret = parseInt(document.getElementById("startingFret").value);
        fretboard.innerHTML = '';
        startingFret = NewStartingFret;
    },
    updateTuning() {
        const NewTuning = document.getElementById("tuningInput").value;
        fretboard.innerHTML = '';
        guitarTuning = getTuningIndexes(NewTuning, notesList);
    },
    updateTitleLabel() {
        const newTitle = document.getElementById("title").value;
        const titleLabel = document.getElementById("title_label");
        titleLabel.innerHTML = newTitle;
    },
    updateStartingFretLabel() {
        const startingFretLabel = document.getElementById('startingFretLabel');
        const startingFret = document.getElementById('startingFret');
        if (startingFret > 1) {
          startingFretLabel.textContent = `${startingFret}fr`;
          startingFretLabel.style.display = 'block';
        } else {
          startingFretLabel.style.display = 'none';
        }
    },
    changeNoteColor(newColor) {
        // Get all the .note-fret elements
        var noteFrets = document.querySelectorAll(".note-fret");
        
        console.log('Changing note colors to:', newColor);
        
        // Iterate through all the .note-fret elements
        noteFrets.forEach(function (noteFret) {
            // Check if the opacity of the .note-fret::before is 0
            if (window.getComputedStyle(noteFret, '::before').opacity === "0") {
            // Add the color-change class to the .note-fret element
            noteFret.classList.add("color-change");
        
            // Change the --note-color variable for the .note-fret element
            noteFret.style.setProperty("--note-color", newColor);
            } else {
            // Remove the color-change class from the .note-fret element
            noteFret.classList.remove("color-change");
            }
        });
    },
    updateTitleColor() {
        const titleColorInput = document.getElementById("titleColor");
        const titleLabel = document.getElementById("title_label");
        titleLabel.style.color = titleColorInput.value;
    },
    updateBackgroundColor() {
        const backgroundColorInput = document.getElementById('backgroundColor');
        const selectedColor = backgroundColorInput.value;
        const editorElement = document.querySelector('.editor');
        const fretboardElement = document.querySelector('.fretboard');
        editorElement.style.backgroundColor = selectedColor;
        fretboardElement.style.backgroundColor = selectedColor;
        if (numberOfStrings == 4 || numberOfStrings == 5) {
            noteFret.classList("left_transparent_border")
        }
    },
    setupEventListeners() {
        document.getElementById('numberOfStrings').addEventListener('change', () => {
            this.updateNumberOfStrings();
            this.updateTuningOptions(numberOfStrings);
            this.setupFretboard();
        });
        document.getElementById('numberOfFrets').addEventListener('change', () => {
            this.updateNumberOfFrets();
            this.setupFretboard();
        });
        document.getElementById('startingFret').addEventListener('change', (event) => {
            this.updateStartingFret();
            this.updateStartingFretLabel();
            this.setupFretboard();
        });
        document.getElementById('tuningInput').addEventListener('change', () => {
            this.updateTuning();
            this.setupFretboard();
        });
        document.getElementById('tuningDropdown').addEventListener('change', (event) => {
            document.getElementById('tuningInput').value = event.target.value;
            this.updateTuning();
            this.setupFretboard();
        });
        document.getElementById('noteColor').addEventListener('change', (event) => {
            var newColor = event.target.value;
            console.log('Color changed to:', newColor);
            this.changeNoteColor(newColor);
        });
        document.getElementById("title").addEventListener("change", () => {
            this.updateTitleLabel();
        });
        document.getElementById("titleDropdown").addEventListener("change", function() {
            const titleInput = document.getElementById("title");
            const titleLabel = document.getElementById("title_label");
            titleInput.value = this.value;
            titleLabel.textContent = this.value;
        });
        document.getElementById("capoDropDown").addEventListener('change', (event) => {
            let selectedCapo = capoDropDown.value;
            this.updateCapoPlacement(selectedCapo);
            fretboard.innerHTML = '';
            this.setupFretboard();
        });
        saveImageButton.addEventListener("click", saveAsPNG);
        document.getElementById("toggleOpenStrings").addEventListener("change", () => {
            makeChords();
        });
        document.getElementById("titleColor").addEventListener("input", () => {
            this.updateTitleColor();
        });
        document.getElementById("backgroundColor").addEventListener("input", () => {
            this.updateBackgroundColor();
        });
        fretboard.addEventListener('click', (event) => {
            if (event.target.classList.contains('note-fret')) {
                if (event.target.parentElement.firstElementChild === event.target) { // Clicked on an open string
                    let currentContent = event.target.getAttribute('data-note'); // get its current value, need to see if it is X or not
                    if (currentContent === 'X') {
                        // If current content is 'X', set it back to the open note value
                        let stringIndex = Array.prototype.indexOf.call(event.target.parentElement.parentElement.children, event.target.parentElement);
                        let openNote = this.generateNoteNames(parseInt(guitarTuning[stringIndex])); // gets the original value back by using the function and putting in the open strings value
                        event.target.setAttribute('data-note', openNote); // reassigns it
                        event.target.style.setProperty('--noteBorder', '1px solid'); // Set the border back to '1px solid' so it has the circle
                        event.target.classList.remove('larger-font'); // make the font smaller again
                    } else {
                        // If current content is not 'X', set it to 'X'
                        event.target.setAttribute('data-note', 'X');
                        event.target.style.setProperty('--noteBorder', 'none'); // Remove the border 
                        event.target.classList.add('larger-font'); // make the font larger
                    }
                } else {
                    // Clicked on other note-frets
                    let currentOpacity = parseFloat(getComputedStyle(event.target).getPropertyValue('--noteOpacity'));
                    let newOpacity = currentOpacity === 1 ? 0 : 1; // if if its 1 then be 0 else be 1
                    event.target.style.setProperty('--noteOpacity', newOpacity); // turn on the fretboard note
                
                    // Toggle the 'first-child-opacity' class for the first child of the parent element
                    let firstChild = event.target.parentElement.firstElementChild;

                    // Set opacity of all other note-frets in the same string to 0
                    let siblingNoteFrets = event.target.parentElement.querySelectorAll('.note-fret:not(:first-child)');
                    siblingNoteFrets.forEach((noteFret) => {
                        if (noteFret !== event.target) { // Exclude the clicked note-fret
                            noteFret.style.setProperty('--noteOpacity', 0);
                        }
                    });

                    // Check if the clicked note-fret opacity is 0 or not
                    if (newOpacity === 0) {
                        firstChild.classList.remove('first-child-opacity');
                    } else {
                        firstChild.classList.add('first-child-opacity');
                    }
                }
            makeChords();
            }
        });
    },
}

function getActiveNotes() {
    const activeNotes = [];
    const noteFrets = document.querySelectorAll('.note-fret'); // Select all note-frets including open strings
    const toggleOpenStrings = document.getElementById('toggleOpenStrings');

    noteFrets.forEach((noteFret, index) => {
        let noteOpacity = parseFloat(getComputedStyle(noteFret, '::before').getPropertyValue('opacity'));
        let noteValue = noteFret.getAttribute('data-note');
        let isFirstNoteFret = noteFret.parentElement.querySelector('.note-fret') === noteFret;

        if (noteOpacity === 1 && noteValue !== 'X' && (toggleOpenStrings.checked || !isFirstNoteFret)) {
            activeNotes.push(noteValue);
        }
    });

    return activeNotes;
}



function getDistances(rootNote, notes) {
    const distances = []; // represents all of the semitones away from our root note
    const rootNoteIndex = notesList.indexOf(rootNote);
  
    notes
      .filter((note) => note !== rootNote) // filter out the root note from the notes array
      .forEach((otherNote) => {
        const otherNoteIndex = notesList.indexOf(otherNote);
        let distance = otherNoteIndex - rootNoteIndex;
  
        if (distance < 0) {
          distance += 12; // Adjust for octave wrap-around
        }
  
        distances.push(distance);
      });
  
    return distances;
  }
  

function findChordName(notes) {
    notes = Array.from(new Set(notes)); // remove any repeated notes
    if (notes.length === 1) {
        return [notes[0]];
    }
    const possibleChordNames = [];
  
    for (let i = 0; i < notes.length; i++) {
        const rootNote = notes[i];
        const distances = getDistances(rootNote, notes);

        // Check for the presence of all possible intervals
        let hasFlatThreeOrSharpNine = distances.includes(intervals.flatThreeOrSharpNine);
        let hasThree = distances.includes(intervals.three);
        let hasFlatSeven = distances.includes(intervals.flatSeven);
        let hasSeven = distances.includes(intervals.seven);
        let hasFive = distances.includes(intervals.five);

        let hasTwoOrNine = distances.includes(intervals.twoOrNine);
        let hasFourOrEleven = distances.includes(intervals.fourOrEleven);
        let hasSixOrThirteen = distances.includes(intervals.sixOrThirteen);

        let hasFlatNine = distances.includes(intervals.flatNine);
        let hasSharpElevenOrFlatFive = distances.includes(intervals.sharpElevenOrFlatFive);
        let hasSharpFiveOrFlatThirteen = distances.includes(intervals.sharpFiveOrFlatThirteen);

        const hadSevenOrFlatSeven = hasSeven || hasFlatSeven; // for use later
  
        if (hasFlatThreeOrSharpNine && hasThree && hasFlatSeven) { 
            hasFlatThreeOrSharpNine = false;
            hasThree = false;
            hasFlatSeven = false;    
            if (hasSixOrThirteen) {
                possibleChordNames.push(rootNote + "13(#9)");
                hasSixOrThirteen = false;
            } else {
                possibleChordNames.push(rootNote + "7(#9)");
            }
        } else if (hasThree) { 
            hasThree = false;
            if (hasSeven) {
                hasSeven = false;
                if (hasSixOrThirteen) {
                    possibleChordNames.push(rootNote + "maj13");
                    hasSixOrThirteen = false;
                } else if (hasTwoOrNine) {
                    possibleChordNames.push(rootNote + "maj9");
                    hasTwoOrNine = false;
                } else if (hasSharpFiveOrFlatThirteen) {
                    possibleChordNames.push(rootNote + "maj7(#5)");
                    hasSharpFiveOrFlatThirteen = false;
                } else {
                    possibleChordNames.push(rootNote + "maj7")
                }
            } else if (hasFlatSeven) {
                hasFlatSeven = false;
                if (hasSixOrThirteen) {
                    hasSixOrThirteen = false;
                    if (hasSharpElevenOrFlatFive) {
                        possibleChordNames.push(rootNote + "13(#11)");
                        hasSharpElevenOrFlatFive = false;
                    } else if (hasFlatNine) {
                        possibleChordNames.push(rootNote + "13(b9)");
                        hasFlatNine = false;
                    } else if (hasSharpFiveOrFlatThirteen) {
                        possibleChordNames.push(rootNote + "13(#5)");
                        hasSharpFiveOrFlatThirteen = false;
                    } else {
                        possibleChordNames.push(rootNote + "13");
                    }
                } else if (hasFourOrEleven) { // in case we don't have a 9 we can still have this
                    possibleChordNames.push(rootNote + "11");
                    hasFourOrEleven = false;
                } else if (hasTwoOrNine) {
                    hasTwoOrNine = false;
                    if (hasSharpElevenOrFlatFive && hasFive) {
                        possibleChordNames.push(rootNote + "9(#11)");
                        hasFive = false;
                        hasSharpElevenOrFlatFive = false;
                    } else if (hasSharpElevenOrFlatFive) {
                        possibleChordNames.push(rootNote + "9b5");
                        hasSharpElevenOrFlatFive = false;
                    } else if (hasSharpFiveOrFlatThirteen) {
                        possibleChordNames.push(rootNote + "9(#5)");
                        hasSharpFiveOrFlatThirteen = false;
                    } else {
                        possibleChordNames.push(rootNote + "9")
                    }
                } else if (hasSharpFiveOrFlatThirteen && hasFive) {
                    possibleChordNames.push(rootNote + "7(b13)");
                    hasSharpFiveOrFlatThirteen = false;
                    hasFive = false;
                } else if (hasSharpElevenOrFlatFive && hasFive) {
                    possibleChordNames.push(rootNote + "7(#11)");
                    hasSharpElevenOrFlatFive = false;
                    hasFive = false;
                } else if (hasFlatNine) {
                    possibleChordNames.push(rootNote + "7(b9)");
                    hasFlatNine = false;
                } else if (hasSharpElevenOrFlatFive) {
                    possibleChordNames.push(rootNote + "7b5");
                    hasSharpElevenOrFlatFive = false;
                } else if (hasSharpFiveOrFlatThirteen) {
                    possibleChordNames.push(rootNote + "7(#5)");
                    hasSharpFiveOrFlatThirteen = false;
                } else {
                    possibleChordNames.push(rootNote + "7");
                }
            } else {
                if (hasSixOrThirteen) {
                    hasSixOrThirteen = false;
                    if (hasSharpElevenOrFlatFive) {
                        possibleChordNames.push(rootNote + "6(#11)");
                        hasSharpElevenOrFlatFive = false;
                    } else if (hasTwoOrNine) {
                        possibleChordNames.push(rootNote + "6/9");
                        hasTwoOrNine = false;
                    } else {
                        possibleChordNames.push(rootNote + "6");
                    }
                } else if (hasSharpFiveOrFlatThirteen) {
                    hasSharpFiveOrFlatThirteen = false;
                    if (hasSharpElevenOrFlatFive) {
                        possibleChordNames.push(rootNote + "+(#11)");
                        hasSharpElevenOrFlatFive = false;
                    } else {
                        possibleChordNames.push(rootNote + "aug");
                    }
                } else {
                    possibleChordNames.push(rootNote + "major");
                }
            }
        } else if (hasFlatThreeOrSharpNine) {
            hasFlatThreeOrSharpNine = false;
            if (hasFlatSeven) {
                hasFlatSeven = false;
                if (hasSixOrThirteen) {
                    possibleChordNames.push(rootNote + "m13");
                    hasSixOrThirteen = false;
                } else if (hasFourOrEleven) {
                    possibleChordNames.push(rootNote + "m11");
                    hasFourOrEleven = false;
                } else if (hasTwoOrNine) {
                    possibleChordNames.push(rootNote + "m9");
                    hasTwoOrNine = false;
                } else {
                    if (hasSharpElevenOrFlatFive) {
                        possibleChordNames.push(rootNote + "m7b5");
                        hasSharpElevenOrFlatFive = false;
                    } else {
                        possibleChordNames.push(rootNote + "m7")
                    }
                }
            } else if (hasSeven) {
                hasSeven = false;
                if (hasTwoOrNine) {
                    possibleChordNames.push(rootNote + "m(maj9)");
                    hasTwoOrNine = false;
                } else {
                    possibleChordNames.push(rootNote + "m(maj7)");
                }
            } else {
                if (hasSharpElevenOrFlatFive) {
                    hasSharpElevenOrFlatFive = false;
                    if (hasSixOrThirteen) {
                        possibleChordNames.push(rootNote + "dim7"); // has the 6 which is our bb7
                        hasSixOrThirteen = false;
                    } else {
                        possibleChordNames.push(rootNote + "dim");
                    }
                } else if (hasSixOrThirteen){
                    hasSixOrThirteen = false;
                    if (hasTwoOrNine) {
                        possibleChordNames.push(rootNote + "m6/9");
                        hasTwoOrNine = false;
                    } else {
                        possibleChordNames.push(rootNote + "m6");
                    }
                } else {
                    possibleChordNames.push(rootNote + "minor")
                }

            }
        } else {
            if (hasTwoOrNine) {
                hasTwoOrNine = false;
                if (hasFlatSeven) {
                    possibleChordNames.push(rootNote + "7sus2");
                    hasFlatSeven = false;
                } else {
                    possibleChordNames.push(rootNote + "sus2");
                }
            } else if (hasFourOrEleven) {
                hasFourOrEleven = false;
                if (hasFlatSeven) {
                    possibleChordNames.push(rootNote + "7sus4");
                    hasFlatSeven = false;
                } else {
                    possibleChordNames.push(rootNote + "sus4")
                }
            } else {
                possibleChordNames.push(rootNote + "5")
                }
            }
        
            const remainingIntervals = [
                { has: hasSeven, add: " add7" },
                { has: hasFlatThreeOrSharpNine, add: " add#9" },
                { has: hasFlatNine, add: " addb9" },
                { has: hasTwoOrNine, add: " add9", alt: " add2" },
                { has: hasFourOrEleven, add: " add11", alt: " add4" },
                { has: hasSixOrThirteen, add: " add13", alt: " add6" },
                { has: hasSharpElevenOrFlatFive, add: " add#11", alt: " addb5" },
                {
                    has: hasSharpFiveOrFlatThirteen,
                    add: hadSevenOrFlatSeven ? " addb13" : hasFive ? " add#5" : " #5",
                },
            ];

            // Count the number of remaining intervals
            let remainingIntervalsCount = 0;
            remainingIntervals.forEach((interval) => {
                if (interval.has) {
                    remainingIntervalsCount++;
                }
            });

            // If there is more than one remaining interval, remove the last entry from possibleChordNames and continue
            if (remainingIntervalsCount > 2) {
                possibleChordNames.pop();
                continue;
            }
            // check remaining intervals if we need to have add for anything
            remainingIntervals.forEach((interval, index) => {
                if (interval.has) {
                    const lastIndex = possibleChordNames.length - 1;
                    // If hasSeven or hasFlatSeven were initially true, use "add" value; otherwise, use "alt" value
                    const addValue = 
                    hadSevenOrFlatSeven && (index >= 1 && index <= 7)
                        ? interval.add
                        : interval.alt || interval.add;
                    possibleChordNames[lastIndex] += addValue;
                }
            });
            

            // check if we need to state the bass note for inversions
            if (i !== 0) {
                const firstNote = notes[0];
                const lastIndex = possibleChordNames.length - 1;
                possibleChordNames[lastIndex] += '/' + firstNote;
            }
    }
    return possibleChordNames.length > 0 ? possibleChordNames : null;
}

function makeChords() {
    const activeNotes = getActiveNotes();
    const possibleChordNames = findChordName(activeNotes); // make our list of chord names
    // console.log('Active notes:', activeNotes);
    const titleDropdown = document.getElementById("titleDropdown");
    titleDropdown.innerHTML = ""; // clear any exisiting options
    if (possibleChordNames) {
        possibleChordNames.forEach((chordName) => {
          const option = document.createElement("option");
          option.text = chordName;
          option.value = chordName;
          titleDropdown.add(option);
        });
      }
    titleDropdown.selectedIndex = -1;    
}

const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}

async function saveAsPNG() {
    const editor = document.querySelector('.editor');
    const title = document.getElementById('title_label').innerText;
    const fileName = title ? title + '.png' : 'chord.png';

    try {
        const canvas = await html2canvas(editor, {
            scale: 0.95, // Add the scale option to resize the resulting image
            useCORS: true,
            backgroundColor: null
        });

        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = fileName;
        link.click();
    } catch (error) {
        console.error('Error creating canvas:', error);
    }
}

app.init();
