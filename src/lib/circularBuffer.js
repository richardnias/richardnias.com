export default class CircularBuffer {
  constructor (capacity) {
    this.capacity = capacity
    this._data = []
  }

  get (_index) {
    return _index < this._data.length ? this._data[_index] : null
  }

  push (value) {
    const oldSlice = this._data.slice(0, this.capacity - 1)
    this._data = [value].concat(oldSlice)
  }

  size () {
    return this._data.length
  }
}
