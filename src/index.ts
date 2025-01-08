export class ProgressIndicator extends HTMLElement {
    calculatedCircumference
    radius:number

    constructor () {
        super()

        // Calculate the circle radius and the normalised version which
        // is radius minus the stroke width
        const radius:number = this.radius = (this.viewBox / 2)
        const normalisedRadius = radius - this.stroke
        this.calculatedCircumference = normalisedRadius * 2 * Math.PI
    }

    static get observedAttributes () {
        return ['progress']
    }

    get viewBox ():number {
        return (this.getAttribute('viewbox') ?
            parseInt(this.getAttribute('viewbox')!) :
            100)
    }

    get stroke ():number {
        return (this.getAttribute('stroke') ?
            parseInt(this.getAttribute('stroke')!) :
            5)
    }

    get label ():string {
        return (
            this.getAttribute('label') ||
            this.getAttribute('aria-label') ||
            'Current progress'
        )
    }

    attributeChangedCallback (name:string, _oldValue, newValue:number):void {
        if (name === 'progress') {
            this.setProgress(newValue)
        }
    }

    connectedCallback () {
        const normalisedRadius = this.radius - this.stroke
        // Set the custom property viewbox value for our CSS to latch on to
        this.style.setProperty('--progress-indicator-viewbox', `${this.viewBox}px`)

        // Set the default aria role states
        this.setAttribute('aria-label', this.label)
        this.setAttribute('role', 'progressbar')
        this.setAttribute('aria-valuemax', '100')
        this.removeAttribute('label')  // not HTML

        // Render the component with all the data ready
        this.innerHTML = `
        <div class="progress-indicator">
            <div class="progress-indicator__visual">
                <div data-progress-count class="progress-indicator__count"></div>

                <svg 
                    fill="none" 
                    viewBox="0 0 ${this.viewBox} ${this.viewBox}"
                    width="${this.viewBox}"
                    height="${this.viewBox}"
                    focusable="false"
                    class="progress-indicator__circle"
                >
                    <circle 
                        r="${normalisedRadius}"
                        cx="${this.radius}"
                        cy="${this.radius}"
                        stroke-width="${this.stroke}"
                        class="progress-indicator__background-circle"
                    />
                    <circle 
                        r="${normalisedRadius}"
                        cx="${this.radius}"
                        cy="${this.radius}"
                        stroke-dasharray="${this.calculatedCircumference} ${this.calculatedCircumference}"
                        stroke-width="${this.stroke}"
                        class="progress-indicator__progress-circle"
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
        </div>
        `

        // so there is no flash of incorrect progress
        const circle = this.querySelector('[data-progress-circle]') as HTMLElement
        circle.style.strokeDashoffset = '' + (this.calculatedCircumference -
            (0 / 100) * this.calculatedCircumference)
    }

    setProgress (_percent:number|string) {
        let percent:number
        if (typeof _percent === 'string') {
            percent = parseInt(_percent)
        } else {
            percent = _percent
        }
        // Always make sure the percentage passed never exceeds the max
        if (percent > 100) {
            percent = 100
        }

        // Set the aria role value for screen readers
        this.setAttribute('aria-valuenow', '' + percent)

        const circle = this.querySelector('[data-progress-circle]') as
            HTMLElement
        const progressCount = this.querySelector('[data-progress-count]') as
            HTMLElement

        if (!circle) {  // if we have not rendered yet
            return setTimeout(() => {
                this.setProgress(percent)
            }, 0)
        }

        // Calculate a dash offset value based on the calculated circumference
        // and the current percentage
        circle.style.strokeDashoffset = '' +
            (this.calculatedCircumference -
            (percent / 100) * this.calculatedCircumference)

        // A human readable version for the text label
        progressCount.innerText = `${percent}%`

        // Set a complete or pending state based on progress
        if (percent === 100) {
            this.setAttribute('data-progress-state', 'complete')
        } else {
            this.setAttribute('data-progress-state', 'pending')
        }
    }
}

customElements.define('progress-indicator', ProgressIndicator)
