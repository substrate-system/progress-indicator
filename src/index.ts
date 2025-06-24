import { html } from './ssr.js'
import { ProgressIndicator as ClientProgressIndicator } from './client.js'

/**
 * Full version that can render & use the DOM.
 */
export class ProgressIndicator extends ClientProgressIndicator {
    connectedCallback () {
        this.render()
        super.connectedCallback()
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
