const xhr = new XMLHttpRequest;

xhr.addEventListener('load', () =>
{
  console.log(xhr.response);
});

// send a request to the backend
xhr.open('GET', 'https://supersimplebackend.dev/');
xhr.send();

