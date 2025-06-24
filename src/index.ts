import { html } from './ssr.js'
import { ProgressIndicator as ClientProgressIndicator } from './client.js'

/**
 * Full version that can render & use the DOM.
 */
export class ProgressIndicator extends ClientProgressIndicator {
    connectedCallback () {
        super.connectedCallback()
        this.render()
    }

    render () {
        this.innerHTML = html({
            viewBox: this.viewBox,
            radius: this.radius,
            stroke: this.stroke,
            calculatedCircumference: this.calculatedCircumference
        })
    }
}
