

import { Widget } from '@lumino/widgets';
import { APODResponse } from '../types/config';


export class APODWidget extends Widget {
    /**
    * Construct a new APOD widget.
    */
    constructor() {
        super();

        this.addClass('my-apodWidget');

        // Add an image element to the panel
        this.aElement = document.createElement('a');
        this.aElement.setAttribute('href','');
        this.aElement.setAttribute('_target','_blank');

        this.img = document.createElement('img');

        this.aElement.appendChild(this.img);
        this.node.appendChild(this.aElement);

        // Add a summary element to the panel
        this.summary = document.createElement('p');
        this.explanation = document.createElement('p');
        this.node.appendChild(this.summary);
        this.node.appendChild(this.explanation);
    }

    /**
    * The image element associated with the widget.
    */
    readonly img: HTMLImageElement;

    /**
    * The anchor element associated with the widget.
    */
    readonly aElement: HTMLAnchorElement;

    /**
    * The summary text element associated with the widget.
    */
    readonly summary: HTMLParagraphElement;

    /**
    * The explanation text element associated with the widget.
    */
    readonly explanation!: HTMLParagraphElement;

    /**
    * Handle update requests for the widget.
    */
    async updateAPODImage(): Promise<void> {
        let date = this.randomDate();
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`);
        https://apod.nasa.gov/apod/apYYMMDD.html
        if (!response.ok) {
            const data = await response.json();
            if (data.error) {
                this.summary.innerText = data.error.message;
            } else {
                
                this.summary.innerText = response.statusText;
            }
            return;
        }

        const data = await response.json() as APODResponse;

        if (data.media_type === 'image') {
            // Populate the image

            this.aElement.href = data.url;
            this.img.src = data.url;
            this.img.title = data.title;
            this.summary.innerText = data.title;
            if (data.copyright) {
                this.summary.innerText += ` (Copyright ${data.copyright})`;
            }

            if (data.explanation) {
                this.explanation.innerText = data.explanation;
            }
        } else {
            this.summary.innerText = 'Random APOD fetched was not an image.';
        }
    }

    /**
    * Get a random date string in YYYY-MM-DD format.
    */
    randomDate(): string {
        const start = new Date(2010, 1, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toISOString().slice(0, 10);
    }
}

