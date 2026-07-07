#!/bin/bash

# Resolve the project root directory (one level up from this script's location)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ""
echo "============================================"
echo "   Database Migration Runner"
echo "============================================"
echo ""

# Array of services with their configurations
declare -A services=(
    ["Inventory"]="src/Services/Inventory/Core:Inventory.Infrastructure:Inventory.Api"
    ["Order"]="src/Services/Order/Core:Order.Infrastructure:Order.Api"
)

# Function to apply migration for a service
apply_migration() {
    local serviceName=$1
    local config=${services[$serviceName]}

    IFS=':' read -r serviceDir infrastructureProject apiProject <<< "$config"

    echo ""
    echo "-- Processing $serviceName Service --"
    echo "   Service directory: $serviceDir"
    echo "   Infrastructure: $infrastructureProject"
    echo "   API: $apiProject"
    echo ""

    cd "$ROOT_DIR/$serviceDir" || {
        echo "[ERROR] Failed to navigate to $serviceDir"
        return 1
    }

    if [ ! -d "$infrastructureProject" ]; then
        echo "[ERROR] Infrastructure project '$infrastructureProject' not found"
        return 1
    fi

    echo "-- Updating database for $serviceName service --"

    dotnet ef database update \
        --project "$infrastructureProject" \
        --startup-project "../Api/$apiProject"

    if [ $? -eq 0 ]; then
        echo "[SUCCESS] Database updated successfully for $serviceName service!"
        return 0
    else
        echo "[ERROR] Failed to update database for $serviceName service"
        return 1
    fi
}

# Main execution
main() {
    cd "$ROOT_DIR" || exit

    echo "-- Ensuring dotnet-ef is installed --"
    dotnet tool install --global dotnet-ef --version 8.0.6 2>/dev/null || echo "dotnet-ef already installed"
    echo ""

    success_count=0
    fail_count=0

    # Apply migrations for all services
    for serviceName in "${!services[@]}"; do
        if apply_migration "$serviceName"; then
            ((success_count++))
        else
            ((fail_count++))
        fi

        # Return to project root directory after each service
        cd "$ROOT_DIR" || exit
    done

    echo ""
    echo "============================================"
    echo "   Migration Summary"
    echo "============================================"
    echo "   Successful: $success_count"
    echo "   Failed: $fail_count"
    echo "============================================"
    echo ""

    if [ $fail_count -eq 0 ]; then
        echo "[SUCCESS] All database migrations completed successfully!"
        exit 0
    else
        echo "[WARNING] Some migrations failed. Please check the errors above."
        exit 1
    fi
}

# Run main function
main
