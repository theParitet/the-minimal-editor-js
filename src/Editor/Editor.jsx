export function Editor({
    handleContentChange,
    handleTitleChange,
    titleRef,
    contentRef,
    file,
    isPanelCollapsed,
}) {
    const placeholder = phrases[Math.floor(Math.random() * phrases.length)];
    const noFileIsSelected = file ? false : true;
    const isDisabled = !isPanelCollapsed;

    return (
        <div className="editor-container">
            <input
                type="text"
                id="editor__title"
                className={noFileIsSelected ? 'editor disabled' : 'editor'}
                placeholder="Your title..."
                spellCheck={true}
                onChange={handleTitleChange}
                ref={titleRef}
                onKeyDown={e => {
                    const key = e.key.toLowerCase();
                    if (key === 'enter' || key === 'arrowdown') {
                        setTimeout(() => {
                            contentRef.current.focus();
                        }, 1);
                    }
                }}
                disabled={noFileIsSelected || isDisabled}
                value={
                    noFileIsSelected
                        ? 'Select or Create a File'
                        : file?.title || ''
                }
            />
            <textarea
                id="editor__main"
                className={noFileIsSelected ? 'editor disabled' : 'editor'}
                onChange={handleContentChange}
                spellCheck={true}
                placeholder={placeholder}
                disabled={noFileIsSelected || isDisabled}
                value={noFileIsSelected ? ' ' : file?.content || ''}
                ref={contentRef}
            ></textarea>
        </div>
    );
}

export const phrases = [
    '😈 Today I will conquer the world!',
    "I'm so excited for the upcoming holidays!",
    '📋 TODO:\n\t- Try baseball',
    'My plans for summer:',
    "I've waken up with the strong intentions to change the world!",
    '😤 Never again do I use regular note taking app. It always breaks!',
    'Ideas worth exploring:',
    '😎 Stay curious.',
    'What did I learn today?',
    '🛑 Top 5 red flags when dating a communist:',
    'A quick summary of my thoughts:',
    "🧠 It's the time for the brainstorm!",
    'Things to improve:',
    '🤩 My creative journey starts here. What should I write...',
    '✨ Write something amazing ;)',
    "Don't forget to save your progress. Oh, wait, it's automatic!",
    "🤔 Maybe it's the time I try out writing poems.",
    'Presentation on adequate sense of humor. Part uno.',
    '🎶 God, I love TheFatRat!',
    '🥋 Was taking karate classes recently...',
    '😅 Backend engineer and QA walk into a bar...',
    'I wish had more free time.',
    'Never saw Bob so quiet...',

    'Inspired by Obsidian, btw.',
];
