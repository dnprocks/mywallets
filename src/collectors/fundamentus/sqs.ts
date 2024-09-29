export const addToQueue = async (queueName: string, securities: string) => {
  // console.log(queueName, securities);

  const rawResponse = await fetch('http://localhost:3000/add', {
    method: 'Post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      queue: queueName,
      body: securities
    })
  });
  if (!rawResponse.ok) {
    throw new Error(`Response status: ${rawResponse.status}`);
  }
  const content = await rawResponse.json();
  return content;
};
