export default function getPropsFromMock(mock) {
  const lastCall = mock.mock.calls.slice().pop()
  return lastCall[0]
}
