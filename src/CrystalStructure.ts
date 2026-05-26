/**
 * Interface representing the parameters that define a crystal structure
 */
export interface CrystalParameters {
  /** The lattice vectors defining the crystal basis */
  latticeVectors: number[][];
  
  /** The atomic positions within the unit cell */
  atomicPositions: { element: string; position: number[] }[];
  
  /** The space group symbol describing the symmetry operations */
  spaceGroup: string;
  
  /** The lattice type (e.g., cubic, hexagonal, etc.) */
  latticeType: 'cubic' | 'hexagonal' | 'tetragonal' | 'orthorhombic' | 'monoclinic' | 'triclinic';
}

/**
 * Class representing a crystal structure with symmetry properties
 */
export class CrystalStructure {
  private params: CrystalParameters;
  private symmetryOperations: string[];

  constructor(params: CrystalParameters) {
    this.params = params;
    this.symmetryOperations = this.extractSymmetryOperations();
  }

  /**
   * Extracts symmetry operations from the space group
   */
  private extractSymmetryOperations(): string[] {
    // In a real implementation, this would parse the space group symbol
    // and generate the actual symmetry operations
    return ['identity', 'inversion', 'rotation', 'reflection'];
  }

  /**
   * Gets the lattice vectors
   */
  getLatticeVectors(): number[][] {
    return this.params.latticeVectors;
  }

  /**
   * Gets the atomic positions
   */
  getAtomicPositions(): { element: string; position: number[] }[] {
    return this.params.atomicPositions;
  }

  /**
   * Gets the space group
   */
  getSpaceGroup(): string {
    return this.params.spaceGroup;
  }

  /**
   * Gets the lattice type
   */
  getLatticeType(): CrystalParameters['latticeType'] {
    return this.params.latticeType;
  }

  /**
   * Checks if the crystal has inversion symmetry
   */
  hasInversionSymmetry(): boolean {
    return this.symmetryOperations.includes('inversion');
  }

  /**
   * Checks if the crystal has rotational symmetry
   */
  hasRotationalSymmetry(): boolean {
    return this.symmetryOperations.some(op => op.includes('rotation'));
  }

  /**
   * Calculates the reciprocal lattice vectors
   */
  getReciprocalLatticeVectors(): number[][] {
    const a = this.params.latticeVectors[0];
    const b = this.params.latticeVectors[1];
    const c = this.params.latticeVectors[2];
    
    const volume = this.calculateVolume(a, b, c);
    
    const a_star = this.crossProduct(b, c).map(v => v / volume);
    const b_star = this.crossProduct(c, a).map(v => v / volume);
    const c_star = this.crossProduct(a, b).map(v => v / volume);
    
    return [a_star, b_star, c_star];
  }

  /**
   * Calculates the volume of the unit cell
   */
  private calculateVolume(a: number[], b: number[], c: number[]): number {
    return Math.abs(this.dotProduct(a, this.crossProduct(b, c)));
  }

  /**
   * Computes the dot product of two vectors
   */
  private dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  /**
   * Computes the cross product of two 3D vectors
   */
  private crossProduct(a: number[], b: number[]): number[] {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
}