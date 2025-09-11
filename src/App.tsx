import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

interface Fruit {
  volume: number;
  weight: number;
}

interface Solution {
  startIndex: number;
  endIndex: number;
  fruits: Fruit[];
  totalVolume: number;
  totalWeight: number;
}

const App: React.FC = () => {
  const [capacity, setCapacity] = useState<number>(0);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [newFruit, setNewFruit] = useState<Fruit>({ volume: 0, weight: 0 });
  const [solution, setSolution] = useState<Solution | null>(null);

  const findOptimalSelection = (): Solution | null => {
    if (fruits.length === 0) return null;

    let maxWeight = 0;
    let bestSolution: Solution | null = null;

    for (let i = 0; i < fruits.length; i++) {
      let currentVolume = 0;
      let currentWeight = 0;

      for (let j = i; j < fruits.length; j++) {
        currentVolume += fruits[j].volume;
        currentWeight += fruits[j].weight;

        if (currentVolume > capacity) {
          break;
        }

        if (currentWeight > maxWeight) {
          maxWeight = currentWeight;
          bestSolution = {
            startIndex: i,
            endIndex: j,
            fruits: fruits.slice(i, j + 1),
            totalVolume: currentVolume,
            totalWeight: currentWeight
          };
        }
      }
    }

    return bestSolution;
  };

  const handleAddFruit = () => {
    if (newFruit.volume > 0 && newFruit.weight > 0) {
      setFruits([...fruits, { ...newFruit }]);
      setNewFruit({ volume: 0, weight: 0 });
      setSolution(null); 
      toast.success('Fruit added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error('Please enter valid volume and weight values!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRemoveFruit = (index: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setFruits(fruits.filter((_, i) => i !== index));
        setSolution(null); 
        
        toast.success('Fruit deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  const handleSolve = () => {
    if (fruits.length === 0) {
      toast.error('Please add at least one fruit!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    if (capacity <= 0) {
      toast.error('Please enter a valid bag capacity!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    const result = findOptimalSelection();
    setSolution(result);
    
    if (result) {
      toast.success('Optimal solution found!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.warning('No valid solution found within the capacity!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleReset = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will clear all your data!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reset everything!'
    }).then((result) => {
      if (result.isConfirmed) {
        setFruits([]);
        setSolution(null);
        setCapacity(0);
        setNewFruit({ volume: 0, weight: 0 });
        
        toast.success('All data has been reset!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddFruit();
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h2 className="mb-0">
                🍎 Fruit Seller Knapsack Optimizer
              </h2>
              <p className="mb-0 mt-2">Find the consecutive group of fruits that maximizes weight within capacity limits</p>
            </div>
            
            <div className="card-body">
              {/* Capacity Input */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">📦 Bag Capacity</h5>
                    </div>
                    <div className="card-body">
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          value={capacity || ''}
                          onChange={(e) => setCapacity(Number(e.target.value))}
                          min="0"
                          step="0.1"
                          placeholder="Enter bag capacity"
                        />
                        <span className="input-group-text">Liters</span>
                      </div>
                      <small className="form-text text-muted">Enter the maximum capacity of your bag in liters</small>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">🍓 Add New Fruit</h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-2">
                        <div className="col">
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Volume"
                              value={newFruit.volume || ''}
                              onChange={(e) => setNewFruit({...newFruit, volume: Number(e.target.value)})}
                              onKeyPress={handleKeyPress}
                              min="0"
                              step="0.1"
                            />
                            <span className="input-group-text">L</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Weight"
                              value={newFruit.weight || ''}
                              onChange={(e) => setNewFruit({...newFruit, weight: Number(e.target.value)})}
                              onKeyPress={handleKeyPress}
                              min="0"
                            />
                            <span className="input-group-text">g</span>
                          </div>
                        </div>
                        <div className="col-auto">
                          <button
                            className="btn btn-success"
                            onClick={handleAddFruit}
                            disabled={!newFruit.volume || !newFruit.weight}
                            title="Add fruit to list"
                          >
                            ➕
                          </button>
                        </div>
                      </div>
                      <small className="form-text text-muted">Press Enter or click + to add fruit</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="d-flex gap-2 flex-wrap">
                    <button 
                      className="btn btn-primary btn-lg" 
                      onClick={handleSolve} 
                      disabled={fruits.length === 0 || capacity <= 0}
                    >
                      🧮 Find Optimal Selection
                    </button>
                    <button className="btn btn-warning" onClick={handleReset}>
                      🔄 Reset All
                    </button>
                  </div>
                </div>
              </div>

              {/* Getting Started Instructions */}
              {fruits.length === 0 && (
                <div className="alert alert-info">
                  <h6>🚀 Getting Started:</h6>
                  <ol className="mb-0 mt-2">
                    <li><strong>Enter your bag capacity</strong> in liters (e.g., 10.5)</li>
                    <li><strong>Add fruits</strong> one by one with their volume and weight</li>
                    <li><strong>Click "Find Optimal Selection"</strong> to see the best consecutive group</li>
                  </ol>
                </div>
              )}

              {/* Capacity Warning */}
              {capacity <= 0 && fruits.length > 0 && (
                <div className="alert alert-warning">
                  ⚠️ Please enter a valid bag capacity (greater than 0) to calculate the optimal selection.
                </div>
              )}

              {/* Fruits List */}
              {fruits.length > 0 && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header bg-secondary text-white">
                        <h5 className="mb-0">
                          📋 Available Fruits ({fruits.length} items)
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <thead className="table-dark">
                              <tr>
                                <th>Index</th>
                                <th>Volume (L)</th>
                                <th>Weight (g)</th>
                                <th>Efficiency (g/L)</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fruits.map((fruit, index) => (
                                <tr 
                                  key={index}
                                  className={
                                    solution && 
                                    index >= solution.startIndex && 
                                    index <= solution.endIndex 
                                      ? 'table-success' 
                                      : ''
                                  }
                                >
                                  <td>
                                    <strong>{index + 1}</strong>
                                    {solution && 
                                     index >= solution.startIndex && 
                                     index <= solution.endIndex && 
                                     <span className="badge bg-success ms-1">Selected</span>
                                    }
                                  </td>
                                  <td>{fruit.volume.toFixed(1)}</td>
                                  <td>{fruit.weight}</td>
                                  <td>{(fruit.weight / fruit.volume).toFixed(1)}</td>
                                  <td>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleRemoveFruit(index)}
                                      title="Remove this fruit"
                                    >
                                      🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Solution Display */}
              {solution && (
                <div className="row">
                  <div className="col-12">
                    <div className="card border-success">
                      <div className="card-header bg-success text-white">
                        <h5 className="mb-0">
                          🏆 Optimal Solution Found!
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="card bg-light">
                              <div className="card-body">
                                <h6 className="card-title">📊 Selection Summary</h6>
                                <ul className="list-unstyled mb-0">
                                  <li><strong>📍 Fruit Range:</strong> Index {solution.startIndex} to {solution.endIndex}</li>
                                  <li><strong>🔢 Number of Fruits:</strong> {solution.fruits.length}</li>
                                  <li><strong>📦 Total Volume:</strong> {solution.totalVolume.toFixed(1)} L</li>
                                  <li><strong>⚖️ Total Weight:</strong> {solution.totalWeight} g</li>
                                  <li><strong>📈 Capacity Used:</strong> {((solution.totalVolume / capacity) * 100).toFixed(1)}%</li>
                                  <li><strong>⚡ Efficiency:</strong> {(solution.totalWeight / solution.totalVolume).toFixed(1)} g/L</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card bg-light">
                              <div className="card-body">
                                <h6 className="card-title">🍎 Selected Fruits Details</h6>
                                <div className="table-responsive">
                                  <table className="table table-sm mb-0">
                                    <thead>
                                      <tr>
                                        <th>Index</th>
                                        <th>Volume (L)</th>
                                        <th>Weight (g)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {solution.fruits.map((fruit, idx) => (
                                        <tr key={idx}>
                                          <td><strong>{solution.startIndex + idx}</strong></td>
                                          <td>{fruit.volume.toFixed(1)}</td>
                                          <td>{fruit.weight}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="mb-2">
                            <label className="form-label">📦 Volume Usage</label>
                            <div className="progress" style={{height: '25px'}}>
                              <div 
                                className="progress-bar bg-primary progress-bar-striped" 
                                role="progressbar" 
                                style={{width: `${(solution.totalVolume / capacity) * 100}%`}}
                                aria-valuenow={(solution.totalVolume / capacity) * 100}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                {solution.totalVolume.toFixed(1)} / {capacity} L ({((solution.totalVolume / capacity) * 100).toFixed(1)}%)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* No solution case */}
              {solution === null && fruits.length > 0 && capacity > 0 && (
                <div className="alert alert-info">
                  💡 Click "Find Optimal Selection" to calculate the best consecutive group of fruits that fits in your bag.
                </div>
              )}

              {/* No valid solution found */}
              {solution === null && fruits.length > 0 && capacity > 0 && (
                <div className="text-center mt-3">
                  <p className="text-muted">Ready to optimize! You have {fruits.length} fruits and a {capacity}L capacity bag.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;