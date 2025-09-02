export const calculateCurrentToken = (service) => {
  if (!service.tokenStartTime || service.paused) return service.currentToken;

  const now = new Date().getTime();
  const start = new Date(service.tokenStartTime).getTime();
  const elapsedMins = Math.floor((now - start) / (1000 * 60));
  const tokensPassed = Math.floor(elapsedMins / service.tokenTime);

  const updatedToken = service.currentToken + tokensPassed;
  return Math.min(updatedToken, service.totalTokens);
};
