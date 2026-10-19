import DOMPurify from 'dompurify';

let policy;

export function trustedTypesAvailable() {
  return typeof window.trustedTypes !== 'undefined';
}

export function getSanitizerPolicy() {
  if (!trustedTypesAvailable()) {
    return null;
  }

  if (!policy) {
    policy = window.trustedTypes.createPolicy('sanitizer', {
      createHTML(input) {
        return DOMPurify.sanitize(String(input));
      },
    });
  }

  return policy;
}
