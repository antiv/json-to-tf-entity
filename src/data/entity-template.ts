export const template: string = `// ============================================================================
// BRAINTRIBE TECHNOLOGY GMBH - www.braintribe.com
// Copyright BRAINTRIBE TECHNOLOGY GMBH, Austria, 2002-2018 - All Rights Reserved
// It is strictly forbidden to copy, modify, distribute or use this code without written permission
// To this file the Braintribe License Agreement applies.
// ============================================================================

package {modelPackage};

import com.braintribe.model.generic.GenericEntity;
import com.braintribe.model.generic.reflection.EntityType;
import com.braintribe.model.generic.reflection.EntityTypes;
{imports}

public interface {entityName} extends GenericEntity {

	EntityType<{entityName}> T = EntityTypes.T({entityName}.class);
	
	/* Constants for each property name. */
	{constants}
	
	{code}
}`;
