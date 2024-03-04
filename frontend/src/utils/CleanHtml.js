import DOMPurify from 'dompurify';

export function cleanHTML(html, setter) {
    if (html) {
        let cleanHTML = DOMPurify.sanitize(html);
        setter(cleanHTML);
    }
}