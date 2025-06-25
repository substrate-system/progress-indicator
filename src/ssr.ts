type Attrs = Partial<{
    viewBox:number;
    radius:number;
    stroke:number;
    calculatedCircumference:string|number;
    label:string;
    progress:number;
}>

/**
 * Strings only, for server-side rendering.
 */

export function html (attrs:Attrs):string {
    const viewBox = attrs.viewBox || 100
    const radius = (viewBox / 2)
    const stroke = attrs.stroke || 5
    const normalisedRadius = radius - stroke
    const calculatedCircumference = normalisedRadius * 2 * Math.PI
    const percent = attrs.progress || 0
    const strokeDashoffset = '' + (calculatedCircumference -
        (percent / 100) * calculatedCircumference)

    return `<div class="progress-indicator" style="--progress-indicator-viewbox: ${viewBox}px;">
        <div class="progress-indicator__visual">
            <div data-progress-count class="progress-indicator__count">
                ${percent}%
            </div>

            <svg 
                fill="none" 
                viewBox="0 0 ${viewBox} ${viewBox}"
                width="${viewBox}"
                height="${viewBox}"
                focusable="false"
                class="progress-indicator__circle"
            >
                <circle 
                    r="${normalisedRadius}"
                    cx="${radius}"
                    cy="${radius}"
                    stroke-width="${stroke}"
                    class="progress-indicator__background-circle"
                />
                <circle 
                    r="${normalisedRadius}"
                    cx="${radius}"
                    cy="${radius}"
                    stroke-dasharray="${calculatedCircumference} ${calculatedCircumference}"
                    stroke-width="${stroke}"
                    class="progress-indicator__progress-circle"
                    style="stroke-dashoffset: ${strokeDashoffset};"
                    data-progress-circle
                />
            </svg>

            <svg 
                class="progress-indicator__check"
                focusable="false" 
                viewBox="0 0 20 20" 
                fill="none"
            >
                <path d="m8.335 12.643 7.66-7.66 1.179 1.178L8.334 15 3.032 9.697 4.21 8.518l4.125 4.125Z" fill="currentColor" />
            </svg>
        </div>
    </div>`
}

export function outerHTML (attrs:Attrs) {
    const label = attrs.label || 'Current progress'
    const percent = attrs.progress || 0

    return `<progress-indicator
        aria-valuenow="${percent || 0}"
        aria-label="${label}"
        aria-valuemax="100"
        progress="${percent || 0}"
        role="progressbar"
    >
        ${html(attrs)}
    </progress-indicator>`
}
