/**
 * Interface defining the parameters for momentum transfer calculations
 */
export interface MomentumParameters {
  /** Initial momentum vector (in units of ħ) */
  initialMomentum: number[];
  /** Final momentum vector (in units of ħ) */
  finalMomentum: number[];
  /** Crystal symmetry operation matrix */
  symmetryOperation: number[][];
  /** Spin quantum number (typically 1/2 for electrons) */
  spinQuantumNumber: number;
  /** Temperature in Kelvin */
  temperature: number;
}

/**
 * Class modeling momentum transfer events in quantum systems
 */
export class MomentumTransfer {
  private params: MomentumParameters;

  constructor(params: MomentumParameters) {
    this.params = params;
  }

  /**
   * Calculates the momentum transfer vector
   * @returns The momentum transfer vector in units of ħ
   */
  public getMomentumTransfer(): number[] {
    const { initialMomentum, finalMomentum } = this.params;
    return initialMomentum.map((p, i) => p - finalMomentum[i]);
  }

  /**
   * Applies crystal symmetry operation to the momentum transfer
   * @returns Transformed momentum transfer vector
   */
  public applySymmetry(): number[] {
    const momentumTransfer = this.getMomentumTransfer();
    const { symmetryOperation } = this.params;
    
    // Apply symmetry operation matrix to momentum transfer vector
    return symmetryOperation.map(row => 
      row.reduce((sum, coeff, colIndex) => sum + coeff * momentumTransfer[colIndex], 0)
    );
  }

  /**
   * Determines if spin reversal is possible given the momentum transfer
   * @returns Boolean indicating if spin reversal can occur
   */
  public canReverseSpin(): boolean {
    const momentumTransfer = this.getMomentumTransfer();
    const magnitude = Math.sqrt(momentumTransfer.reduce((sum, x) => sum + x * x, 0));
    
    // Spin reversal typically occurs when momentum transfer is significant
    // and aligns with crystal symmetry constraints
    return magnitude > 0.5; // Threshold value - could be made more sophisticated
  }

  /**
   * Calculates the probability of spin reversal event
   * @returns Probability value between 0 and 1
   */
  public calculateSpinReversalProbability(): number {
    const { temperature, spinQuantumNumber } = this.params;
    const momentumTransfer = this.getMomentumTransfer();
    const magnitude = Math.sqrt(momentumTransfer.reduce((sum, x) => sum + x * x, 0));
    
    // Simplified model: probability increases with momentum transfer magnitude
    // and decreases with temperature
    const baseProbability = Math.min(1, magnitude / 2);
    const temperatureFactor = 1 / (1 + temperature / 100);
    
    return baseProbability * temperatureFactor;
  }
}